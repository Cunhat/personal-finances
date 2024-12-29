import { UnprocessedTransaction } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const unprocessedTransactionSchema = createInsertSchema(
  UnprocessedTransaction,
);

export type UnprocessedTransaction = z.infer<
  typeof unprocessedTransactionSchema
>;
