import { account } from "@/server/db/schema";
import z from "node_modules/zod/lib";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const insertAccountSchema = createInsertSchema(account);
const selectAccountSchema = createSelectSchema(account);

export type Account = typeof account.$inferSelect;

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
