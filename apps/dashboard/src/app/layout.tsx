import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@repo/wallet-core";

export const metadata: Metadata = {
  title: { default: "ChainPay", template: "%s · ChainPay" },
  description: "Crypto payment infrastructure for modern merchants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
