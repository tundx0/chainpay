"use client";

const STEPS = [
  { key: "detected", label: "Detected" },
  { key: "confirming", label: "Confirming" },
  { key: "completed", label: "Confirmed" },
] as const;

function stepIndex(status: string): number {
  const map: Record<string, number> = {
    pending: -1,
    detected: 0,
    confirming: 1,
    completed: 2,
    failed: -1,
    expired: -1,
  };
  return map[status] ?? -1;
}

interface ConfirmationProgressProps {
  status: string;
  confirmations: number;
  required: number;
  isLive: boolean;
}

export function ConfirmationProgress({
  status,
  confirmations,
  required,
  isLive,
}: ConfirmationProgressProps) {
  const pct =
    status === "completed"
      ? 100
      : Math.min((confirmations / required) * 100, 99);

  const currentStep = stepIndex(status);

  return (
    <div className="card flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-mono">
          Confirmation Progress
        </p>
        {isLive && (
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-accent">
            <span className="cyber-pulse-dot" />
            LIVE
          </span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="cyber-telemetry-num">
          {status === "completed" ? required : confirmations}
        </span>
        <span className="text-muted font-mono text-sm mb-1">
          / {required} confirmations
        </span>
      </div>

      <div className="relative h-2 bg-surface-raised rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background:
              status === "completed"
                ? "var(--accent)"
                : status === "failed" || status === "expired"
                  ? "var(--danger)"
                  : "linear-gradient(90deg, var(--accent) 0%, rgba(204,255,0,0.6) 100%)",
            boxShadow:
              status !== "failed" && status !== "expired"
                ? "0 0 8px rgba(204,255,0,0.4)"
                : undefined,
          }}
        />
      </div>

      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-3 h-px bg-border" />

        {STEPS.map((step, i) => {
          const done = currentStep >= i;
          const active = currentStep === i;
          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-2 z-10"
            >
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500"
                style={{
                  borderColor: done ? "var(--accent)" : "var(--border)",
                  background: done ? "var(--accent)" : "var(--surface)",
                  boxShadow: active
                    ? "0 0 10px rgba(204,255,0,0.5)"
                    : undefined,
                }}
              >
                {done && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m2 6 3 3 5-6" />
                  </svg>
                )}
              </div>
              <span
                className="text-[10px] font-mono tracking-wide transition-colors duration-300"
                style={{ color: done ? "var(--accent)" : "var(--text-muted)" }}
              >
                {step.label.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
