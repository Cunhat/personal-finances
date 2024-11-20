import { category, transaction } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectTransactionSchema = createSelectSchema(transaction).extend({
  category: createSelectSchema(category),
});

export type Transaction = z.infer<typeof selectTransactionSchema>;
