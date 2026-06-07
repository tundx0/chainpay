"use client";

import { useRouter } from "next/navigation";
import { CreatePaymentForm } from "../../../../components/payments/create-payment-form";

export default function NewPaymentPage() {
  const router = useRouter();

  return (
    <div className="fade-up max-w-[480px]">
      <div className="page-header mb-5">
        <div>
          <h1 className="page-title">New Payment</h1>
          <p className="page-desc">
            Generate a checkout link to share with your customer.
          </p>
        </div>
      </div>

      <div className="card">
        <CreatePaymentForm
          onSuccess={() => setTimeout(() => router.push("/payments"), 3000)}
        />
      </div>
    </div>
  );
}
