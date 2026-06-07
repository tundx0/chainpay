import type { Metadata } from "next";
import { QueryProvider } from "@repo/wallet-core";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChainPay | The Developer-First Web3 Payment Gateway",
  description: "Integrate high-speed checkout, live telemetry monitoring, and automated on-chain settlement validation for EVM blockchains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg text-text-primary antialiased selection:bg-accent-dim selection:text-accent-hover">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
