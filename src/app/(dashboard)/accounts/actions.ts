"use server";

import { account } from "@/server/db/schema";
import { db } from "@/server/db";
import { authenticatedActionClient } from "@/server/safe-actions";
import { AccountSchema } from "@/schemas/account";
import { returnValidationErrors } from "next-safe-action";

export const createAccount = authenticatedActionClient
  .schema(AccountSchema)
  .action(
    async ({ parsedInput: { name, balance, accountType }, ctx: { user } }) => {
      const existingAccount = await db.query.account.findFirst({
        where: (account, { eq, and }) =>
          and(eq(account.name, name), eq(account.userId, user.id)),
      });

      if (existingAccount) {
        returnValidationErrors(AccountSchema, {
          name: { _errors: ["Account with this name already exists"] },
        });
      }

      await db.insert(account).values({
        name,
        balance,
        accountType,
        userId: user.id,
      });
    },
  );