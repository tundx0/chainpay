import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "../../packages/payment-core/src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgres://chainpay:chainpay@localhost:5432/chainpay",
  },
});
