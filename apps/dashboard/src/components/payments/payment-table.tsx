"use client";

import type { PaymentRequest } from "@repo/payment-core";

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  completed:
    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  failed:
    "bg-red-500/15 text-red-400 border border-red-500/30",
  expired:
    "bg-zinc-700/40 text-zinc-400 border border-zinc-700",
};

interface PaymentTableProps {
  payments: PaymentRequest[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 py-16 text-center text-zinc-500">
        <p className="text-sm">No payment requests yet.</p>
        <p className="mt-1 text-xs text-zinc-600">
          Create one above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60">
            {["ID", "Amount", "Currency", "Network", "Status", "Created At"].map(
              (col) => (
                <th
                  key={col}
                  className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/20">
          {payments.map((p) => (
            <tr
              key={p.id}
              className="transition-colors hover:bg-zinc-800/30"
            >
              <td className="px-4 py-3.5 font-mono text-xs text-indigo-400">
                {p.id}
              </td>
              <td className="px-4 py-3.5 font-semibold text-white">
                {Number(p.amount).toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-zinc-300">{p.currency}</td>
              <td className="px-4 py-3.5 capitalize text-zinc-300">
                {p.network}
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[p.status] ?? ""}`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3.5 text-zinc-500">
                {new Date(p.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
