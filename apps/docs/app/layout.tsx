import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "ChainPay Docs - Web3 Payment Gateway Documentation",
  description: "Developer guides, API references, Widget SDK guides, and self-hosted VPS deployment instructions for ChainPay crypto payment gateway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="docs-layout">
          <Sidebar />
          <main className="docs-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
