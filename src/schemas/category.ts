import { category, categoryGroup, transaction } from "@/server/db/schema";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";

import { selectTransactionSchema } from "./transaction";

export const selectCategorySchema = createSelectSchema(category);

export type Category = z.infer<typeof selectCategorySchema>;

export const CategoryValidationSchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1).emoji(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
});

export type CreateCategory = z.infer<typeof CategoryValidationSchema>;

export const selectCategoryWithTransactionsSchema = selectCategorySchema.extend(
  {
    transactions: selectTransactionSchema.array(),
  },
);

export type CategoryWithTransactions = z.infer<
  typeof selectCategoryWithTransactionsSchema
>;

export const GroupValidationSchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
});

export type CreateGroup = z.infer<typeof GroupValidationSchema>;

export const selectCategoryGroupSchema = createSelectSchema(
  categoryGroup,
).extend({
  categories: selectCategorySchema.array(),
});

export type CategoryGroupWithCategories = z.infer<
  typeof selectCategoryGroupSchema
>;
