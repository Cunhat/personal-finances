import { UnprocessedTransaction } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const UnprocessedTransactionSchema = createInsertSchema(
  UnprocessedTransaction,
);

export type UnprocessedTransaction = z.infer<
  typeof UnprocessedTransactionSchema
>;
