import { db } from "./index";
import { merchantWallets } from "@repo/payment-core";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Seeding merchant wallets...");

  const wallets = [
    {
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Anvil account[1] — used for base
      network: "base" as const,
    },
    {
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Anvil account[2] — used for ethereum
      network: "ethereum" as const,
    },
    {
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Anvil account[0] — localhost (Foundry default)
      network: "localhost" as const,
    },
  ];

  for (const wallet of wallets) {
    const [existing] = await db
      .select()
      .from(merchantWallets)
      .where(eq(merchantWallets.network, wallet.network))
      .limit(1);

    if (!existing) {
      await db.insert(merchantWallets).values(wallet);
      console.log(`✅ Seeded ${wallet.network} wallet: ${wallet.address}`);
    } else {
      console.log(
        `ℹ️ ${wallet.network} wallet already exists: ${existing.address}`,
      );
    }
  }

  console.log("🌱 Seeding finished.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
