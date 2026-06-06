"use client";

import { useRouter } from "next/navigation";
import { CreatePaymentForm } from "../../../../components/payments/create-payment-form";

export default function NewPaymentPage() {
  const router = useRouter();

  return (
    <div className="fade-up" style={{ maxWidth: 480 }}>
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">New Payment</h1>
          <p className="page-desc">Generate a checkout link to share with your customer.</p>
        </div>
      </div>

      <div className="card">
        <CreatePaymentForm onSuccess={() => setTimeout(() => router.push("/payments"), 3000)} />
      </div>
    </div>
  );
}
