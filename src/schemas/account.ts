import { account, accountRelations } from "@/server/db/schema";
import z from "node_modules/zod/lib";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { transaction } from "@/server/db/schema";

const insertAccountSchema = createInsertSchema(account);
const selectAccountSchema = createSelectSchema(account).extend({
  transaction: z.array(createSelectSchema(transaction)).optional(),
});

export type Account = z.infer<typeof selectAccountSchema>;

export const AccountValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  accountType: z.string().min(1, "Account type is required"),
  balance: z
    .number()
    .min(0, "Balance must be positive")
    .multipleOf(
      0.01,
      "Amount must be a valid currency value with 2 decimal places",
    ),
});

export type AccountValidation = z.infer<typeof AccountValidationSchema>;
