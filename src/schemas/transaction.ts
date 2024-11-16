import { createSelectSchema } from "drizzle-zod";
import { transaction } from "@/server/db/schema";
import { z } from "zod";
import { selectCategorySchema } from "./category";

export const selectTransactionSchema = createSelectSchema(transaction).extend({
  category: selectCategorySchema,
});

export type Transaction = z.infer<typeof selectTransactionSchema>;
