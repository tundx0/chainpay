import {
  decodeEventLog,
  erc20Abi,
  getAddress,
  parseAbiItem,
  type Hash,
} from "viem";
import type { ChainClient } from "../clients/chain-client";
import { getRequiredConfirmations, getTokenConfig } from "../constants/tokens";
import { parseAmountToAtomic } from "../utils/parse-amount";
import type { PaymentRequest, PaymentStatus } from "../types/payment";
import type { Currency, Network } from "../types/payment";

const transferEvent = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

export interface WatcherUpdate {
  txHash: string;
  payerAddress: string;
  blockNumber: string;
  confirmations: number;
  status: Extract<
    PaymentStatus,
    "detected" | "confirming" | "completed" | "failed"
  >;
}

const LOG_SCAN_BLOCK_WINDOW = BigInt(5000);

interface ParsedTransfer {
  from: `0x${string}`;
  to: `0x${string}`;
  value: bigint;
}

function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

function resolveStatus(
  confirmations: number,
  requiredConfirmations: number,
): WatcherUpdate["status"] {
  if (confirmations >= requiredConfirmations) {
    return "completed";
  }

  if (confirmations >= 1) {
    return "confirming";
  }

  return "detected";
}

function getExpectedAmount(payment: PaymentRequest): bigint {
  return parseAmountToAtomic(
    payment.amount,
    payment.network as Network,
    payment.currency as Currency,
  );
}

function getMerchantAddress(payment: PaymentRequest): `0x${string}` {
  if (!payment.merchantAddress) {
    throw new Error(`Payment ${payment.id} is missing merchant address`);
  }

  return getAddress(payment.merchantAddress);
}

export class PaymentVerificationService {
  async inspectPayment(
    client: ChainClient,
    payment: PaymentRequest,
  ): Promise<WatcherUpdate | null> {
    if (payment.currency === "BTC") {
      return null;
    }

    if (!payment.merchantAddress) {
      console.warn(
        `[watcher] Payment ${payment.id} is missing merchant address, skipping.`,
      );
      return null;
    }

    const network = payment.network as Network;
    const currency = payment.currency as Currency;
    const token = getTokenConfig(network, currency);
    const requiredConfirmations = getRequiredConfirmations(network);
    const expectedAmount = getExpectedAmount(payment);
    const merchantAddress = getMerchantAddress(payment);

    if (payment.txHash) {
      return this.inspectKnownTransaction(client, payment.txHash as Hash, {
        tokenType: token.type,
        tokenAddress: token.contractAddress,
        merchantAddress,
        expectedAmount,
        requiredConfirmations,
        payerAddress: payment.payerAddress,
      });
    }

    if (
      payment.status !== "pending" ||
      token.type !== "erc20" ||
      !token.contractAddress
    ) {
      return null;
    }

    return this.scanForErc20Transfer(client, {
      tokenAddress: token.contractAddress,
      merchantAddress,
      expectedAmount,
      requiredConfirmations,
    });
  }

  private async inspectKnownTransaction(
    client: ChainClient,
    txHash: Hash,
    params: {
      tokenType: "native" | "erc20";
      tokenAddress?: `0x${string}`;
      merchantAddress: `0x${string}`;
      expectedAmount: bigint;
      requiredConfirmations: number;
      payerAddress: string | null;
    },
  ): Promise<WatcherUpdate | null> {
    let receipt;

    try {
      receipt = await client.getTransactionReceipt({ hash: txHash });
    } catch {
      return null;
    }

    if (receipt.status === "reverted") {
      return {
        txHash: txHash.toLowerCase(),
        payerAddress: params.payerAddress ?? receipt.from,
        blockNumber: receipt.blockNumber.toString(),
        confirmations: 0,
        status: "failed",
      };
    }

    const currentBlock = await client.getBlockNumber();
    const confirmations = Number(
      currentBlock - receipt.blockNumber + BigInt(1),
    );

    if (params.tokenType === "native") {
      const tx = await client.getTransaction({ hash: txHash });

      if (
        !tx ||
        normalizeAddress(tx.to ?? "") !==
          normalizeAddress(params.merchantAddress) ||
        tx.value < params.expectedAmount
      ) {
        return null;
      }

      return {
        txHash: txHash.toLowerCase(),
        payerAddress: normalizeAddress(tx.from),
        blockNumber: receipt.blockNumber.toString(),
        confirmations,
        status: resolveStatus(confirmations, params.requiredConfirmations),
      };
    }

    if (!params.tokenAddress) {
      return null;
    }

    const transfer = receipt.logs
      .map((log: (typeof receipt.logs)[number]): ParsedTransfer | null => {
        if (
          normalizeAddress(log.address) !==
          normalizeAddress(params.tokenAddress!)
        ) {
          return null;
        }

        try {
          const decoded = decodeEventLog({
            abi: erc20Abi,
            eventName: "Transfer",
            data: log.data,
            topics: log.topics,
          });

          return {
            from: decoded.args.from as `0x${string}`,
            to: decoded.args.to as `0x${string}`,
            value: decoded.args.value as bigint,
          };
        } catch {
          return null;
        }
      })
      .find(
        (entry): entry is ParsedTransfer =>
          entry !== null &&
          normalizeAddress(entry.to) ===
            normalizeAddress(params.merchantAddress) &&
          entry.value >= params.expectedAmount,
      );

    if (!transfer) {
      return null;
    }

    return {
      txHash: txHash.toLowerCase(),
      payerAddress: normalizeAddress(transfer.from),
      blockNumber: receipt.blockNumber.toString(),
      confirmations,
      status: resolveStatus(confirmations, params.requiredConfirmations),
    };
  }

  private async scanForErc20Transfer(
    client: ChainClient,
    params: {
      tokenAddress: `0x${string}`;
      merchantAddress: `0x${string}`;
      expectedAmount: bigint;
      requiredConfirmations: number;
    },
  ): Promise<WatcherUpdate | null> {
    const currentBlock = await client.getBlockNumber();
    const fromBlock =
      currentBlock > LOG_SCAN_BLOCK_WINDOW
        ? currentBlock - LOG_SCAN_BLOCK_WINDOW
        : BigInt(0);

    const logs = await client.getLogs({
      address: params.tokenAddress,
      event: transferEvent,
      args: {
        to: params.merchantAddress,
      },
      fromBlock,
      toBlock: currentBlock,
    });

    const matches = logs
      .map((log) => {
        const value = log.args.value;
        if (value === undefined || value < params.expectedAmount) {
          return null;
        }

        return {
          txHash: log.transactionHash!.toLowerCase(),
          payerAddress: normalizeAddress(log.args.from!),
          blockNumber: log.blockNumber!.toString(),
        };
      })
      .filter(Boolean) as Array<{
      txHash: string;
      payerAddress: string;
      blockNumber: string;
    }>;

    if (matches.length === 0) {
      return null;
    }

    const latestMatch = matches[matches.length - 1]!;
    const confirmations = Number(
      currentBlock - BigInt(latestMatch.blockNumber) + BigInt(1),
    );

    return {
      ...latestMatch,
      confirmations,
      status: resolveStatus(confirmations, params.requiredConfirmations),
    };
  }
}
