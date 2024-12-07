import { account, category, transaction } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { selectCategorySchema } from "./category";

export const selectTransactionSchema = createSelectSchema(transaction).extend({
  category: createSelectSchema(category),
  account: createSelectSchema(account),
});

export type Transaction = z.infer<typeof selectTransactionSchema>;

export const TransactionValidationSchema = z.object({
  name: z.string().min(1),
  amount: z.number().min(0),
  date: z.date(),
  account: z.string(),
  category: z.string(),
});

export type CreateTransaction = z.infer<typeof TransactionValidationSchema>;
