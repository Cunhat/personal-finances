"use server";

import { account, transaction } from "@/server/db/schema";
import { db } from "@/server/db";
import { authenticatedActionClient } from "@/server/safe-actions";
import { Account, AccountValidationSchema } from "@/schemas/account";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";
import z from "node_modules/zod/lib";
import dayjs from "dayjs";

export const createAccount = authenticatedActionClient
  .schema(AccountValidationSchema)
  .action(
    async ({ parsedInput: { name, balance, accountType }, ctx: { user } }) => {
      const existingAccount = await db.query.account.findFirst({
        where: (account, { eq, and }) =>
          and(eq(account.name, name), eq(account.userId, user.id)),
      });

      if (existingAccount) {
        returnValidationErrors(AccountValidationSchema, {
          name: { _errors: ["Account with this name already exists"] },
        });
      }

      await db.insert(account).values({
        name,
        balance,
        initialBalance: balance,
        accountType,
        userId: user.id,
      });

      revalidatePath("/accounts");
    },
  );

//TODO: FIX CASCADE DELETE
export const deleteAccount = authenticatedActionClient
  .schema(z.object({ accountId: z.number() }))
  .action(async ({ parsedInput: { accountId }, ctx: { user } }) => {
    await db
      .delete(transaction)
      .where(
        and(
          eq(transaction.accountId, accountId),
          eq(transaction.userId, user.id),
        ),
      );

    await db
      .delete(account)
      .where(and(eq(account.id, accountId), eq(account.userId, user.id)));

    revalidatePath("/accounts");
    revalidateTag("accounts");
  });

export const getAccounts = unstable_cache(
  async (userId: string) => {
    return await db.query.account.findMany({
      where: eq(account.userId, userId),
      with: {
        transaction: {
          orderBy: (transaction, { desc }) => [desc(transaction.created_at)],
          with: {
            category: true,
          },
        },
      },
    });
  },
  ["accounts"],
  {
    revalidate: 5,
  },
);
