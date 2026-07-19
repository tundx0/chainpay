"use client";

import { useState } from "react";
import { useSendTransaction, useWriteContract } from "wagmi";
import { parseUnits, erc20Abi } from "viem";
import { Button } from "@repo/ui/button";
import { useWallet } from "@repo/wallet-core";
import { paymentClient, getTokenConfig } from "@repo/payment-core";
import type { PaymentRequest, Currency, Network } from "@repo/payment-core";

interface RefundButtonProps {
  payment: PaymentRequest;
  onRefunded: () => void;
}

export function RefundButton({ payment, onRefunded }: RefundButtonProps) {
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const handleRefund = async () => {
    if (!address || !payment.payerAddress) {
      setError("Wallet not connected or payer address missing");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const config = getTokenConfig(payment.network as Network, payment.currency as Currency);
      const amountAtomic = parseUnits(payment.amount, config.decimals);
      
      if (config.type === "native") {
        await sendTransactionAsync({
          to: payment.payerAddress as `0x${string}`,
          value: amountAtomic,
        });
      } else {
        if (!config.contractAddress) throw new Error("Missing contract address");
        await writeContractAsync({
          address: config.contractAddress,
          abi: erc20Abi,
          functionName: "transfer",
          args: [payment.payerAddress as `0x${string}`, amountAtomic],
        });
      }

      await paymentClient.refundPayment(payment.id, address);
      onRefunded();
    } catch (err: any) {
      setError(err.message || "Failed to process refund transaction");
    } finally {
      setLoading(false);
    }
  };

  if (payment.status !== "completed") return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Button
        variant="danger"
        onClick={handleRefund}
        disabled={loading || !address || !payment.payerAddress}
        className="w-full text-xs font-mono py-2"
      >
        {loading ? "PROCESSING_REFUND..." : "ISSUE_REFUND"}
      </Button>
      {error && <span className="text-red-400 text-xs font-mono break-all">{error}</span>}
    </div>
  );
}
