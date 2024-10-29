import { defineConfig, type Config } from "drizzle-kit";

import { env } from "@/env";


if (!env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_NAME is missing");
}

const url = env.TURSO_DATABASE_URL;

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url,
    authToken: env.TURSO_GROUP_AUTH_TOKEN,
  },
}) satisfies Config;
