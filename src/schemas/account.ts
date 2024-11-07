import { account } from "@/server/db/schema";
import z from "node_modules/zod/lib";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const insertAccountSchema = createInsertSchema(account);
const selectAccountSchema = createSelectSchema(account);

// export const AccountSchema = insertAccountSchema.omit({
//   id: true,
//   userId: true,
// });

export const AccountSchema = z.object({
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

export type Account = z.infer<typeof AccountSchema>;

type AccountType = {
  accountType: "bank" | "investment" | "credit";
  name: string;
  accounts: Array<{ name: string; description: string }>;
};

export type AccountTypes = AccountType[];
