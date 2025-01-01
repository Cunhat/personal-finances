import { unprocessedTransaction } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const UnprocessedTransactionSchema = createInsertSchema(
  unprocessedTransaction,
);

export type UnprocessedTransaction = z.infer<
  typeof UnprocessedTransactionSchema
>;
