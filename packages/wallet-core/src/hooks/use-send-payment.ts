import { usePublicClient, useSendTransaction, useWriteContract } from "wagmi";
import { erc20Abi, type Hash } from "viem";
import type {
  SendPaymentParams,
  SendPaymentResult,
} from "../types/payment-send";

function formatSendError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Payment processing failed.";
  }

  const message = error.message;

  if (
    /user rejected|denied|cancelled|canceled|connection request reset/i.test(
      message,
    )
  ) {
    return "Transaction rejected in wallet.";
  }

  if (/insufficient funds/i.test(message)) {
    return "Insufficient funds for this payment.";
  }

  return message;
}

export function useSendPayment() {
  const publicClient = usePublicClient();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const sendPayment = async (
    params: SendPaymentParams,
  ): Promise<SendPaymentResult> => {
    if (!publicClient) {
      throw new Error("Wallet client is not ready.");
    }

    try {
      let hash: Hash;

      if (params.tokenType === "native") {
        hash = await sendTransactionAsync({
          to: params.merchantAddress,
          value: params.amountAtomic,
          chainId: params.chainId,
        });
      } else {
        if (!params.tokenAddress) {
          throw new Error(
            "Token contract address is required for ERC-20 payments.",
          );
        }

        hash = await writeContractAsync({
          address: params.tokenAddress,
          abi: erc20Abi,
          functionName: "transfer",
          args: [params.merchantAddress, params.amountAtomic],
          chainId: params.chainId,
        });
      }

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1,
      });

      if (receipt.status === "reverted") {
        throw new Error("Transaction reverted on-chain.");
      }

      return { txHash: hash };
    } catch (error) {
      throw new Error(formatSendError(error));
    }
  };

  return { sendPayment };
}
