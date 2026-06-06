import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@repo/payment-core/src/db/schema.ts";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://chainpay:chainpay@localhost:5432/chainpay";

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
