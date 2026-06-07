"use client";

import React from "react";
import QRCode from "react-qr-code";

interface PaymentQrProps {
  uri: string;
}

export function PaymentQr({ uri }: PaymentQrProps) {
  return (
    <div className="flex flex-col items-center justify-center p-5 bg-zinc-950/40 border border-border/80 rounded-2xl">
      <div className="p-3.5 bg-white rounded-2xl shadow-lg shadow-black/40">
        <QRCode
          value={uri}
          size={160}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          viewBox={`0 0 256 256`}
        />
      </div>
      <p className="text-[11px] text-text-muted mt-3 text-center font-medium leading-normal max-w-[220px]">
        Scan QR code with any Web3 wallet to make payment.
      </p>
    </div>
  );
}
