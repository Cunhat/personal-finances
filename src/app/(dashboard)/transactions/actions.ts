"use server";

import {
  TransactionValidationSchema,
  updateTransactionSchema,
} from "@/schemas/transaction";
import { authenticatedActionClient } from "@/server/safe-actions";
import { db } from "@/server/db";
import { category, account, transaction } from "@/server/db/schema";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import dayjs from "dayjs";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";

export const createTransaction = authenticatedActionClient
  .schema(TransactionValidationSchema)
  .action(
    async ({
      parsedInput: {
        name,
        amount,
        date,
        account: requestAccount,
        category,
        transactionType,
      },
      ctx: { user },
    }) => {
      const createdAt = dayjs(date).toISOString();

      const newTransaction = await db.insert(transaction).values({
        //@ts-expect-error drizzle types
        name,
        value: amount,
        created_at: createdAt,
        transactionType: transactionType,
        accountId: requestAccount,
        categoryId: category,
        userId: user.id,
      });

      if (newTransaction) {
        await updateAccountBalance(
          Number(requestAccount),
          transactionType === "income" ? amount : -amount,
        );
      }

      revalidatePath("/transactions");
    },
  );

const updateAccountBalance = async (accountId: number, amount: number) => {
  await db
    .update(account)
    .set({
      balance: sql`${account.balance} + ${amount}`,
    })
    .where(eq(account.id, accountId));

  revalidatePath("/accounts");
};

export const deleteTransaction = authenticatedActionClient
  .schema(
    z.object({
      id: z.number(),
    }),
  )
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const deletedTransaction = await db
      .delete(transaction)
      .where(and(eq(transaction.id, id), eq(transaction.userId, user.id)))
      .returning();

    if (deletedTransaction.length && deletedTransaction[0]) {
      const accountId = deletedTransaction[0].accountId;
      const amount =
        deletedTransaction[0].transactionType === "income"
          ? -deletedTransaction[0].value
          : deletedTransaction[0].value;

      await updateAccountBalance(accountId, amount);
    }

    revalidatePath("/transactions");
  });

export const updateTransaction = authenticatedActionClient
  .schema(updateTransactionSchema)
  .action(async ({ parsedInput: { id, ...values }, ctx: { user } }) => {
    const oldTransaction = await db
      .select()
      .from(transaction)
      .where(and(eq(transaction.id, id), eq(transaction.userId, user.id)));

    const updatedTransaction = await db
      .update(transaction)
      .set({
        name: values.name,
        value: values.amount,
        created_at: dayjs(values.date).toISOString(),
        accountId: Number(values.account),
        categoryId: Number(values.category),
        transactionType: values.transactionType,
      })
      .where(and(eq(transaction.id, id), eq(transaction.userId, user.id)))
      .returning();

    if (updatedTransaction.length && updatedTransaction[0]) {
      const accountId = updatedTransaction[0].accountId;
      let amount = 0;

      if (
        oldTransaction[0]?.transactionType ===
        updatedTransaction[0]?.transactionType
      ) {
        const transactionTypeMultiplier =
          oldTransaction[0]?.transactionType === "income" ? -1 : 1;

        amount =
          (oldTransaction[0].value - updatedTransaction[0].value) *
          transactionTypeMultiplier;

        await updateAccountBalance(accountId, amount);
      } else {
        const transactionTypeMultiplier =
          oldTransaction[0]?.transactionType === "income" ? -1 : 1;
        amount =
          transactionTypeMultiplier * oldTransaction[0]!.value +
          values.amount * transactionTypeMultiplier;

        await updateAccountBalance(accountId, amount);
      }
    }

    revalidateTag("transactions");
    revalidatePath("/transactions");
  });

export const getAccountsAndCategories = unstable_cache(
  async (userId: string) => {
    const accountsQuery = db.query.account.findMany({
      where: eq(account.userId, userId),
    });

    const categoriesQuery = db.query.category.findMany({
      where: eq(category.userId, userId),
    });

    const [accounts, categories] = await Promise.all([
      accountsQuery,
      categoriesQuery,
    ]);

    return { accounts, categories };
  },
  ["accounts", "categories"],
);
