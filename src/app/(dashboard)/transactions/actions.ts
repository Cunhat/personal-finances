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
import { and, eq } from "drizzle-orm";

export const createTransaction = authenticatedActionClient
  .schema(TransactionValidationSchema)
  .action(
    async ({
      parsedInput: { name, amount, date, account, category, transactionType },
      ctx: { user },
    }) => {
      const createdAt = dayjs(date).toISOString();

      await db.insert(transaction).values({
        //@ts-expect-error drizzle types
        name,
        value: amount,
        created_at: createdAt,
        transactionType: transactionType,
        accountId: account,
        categoryId: category,
        userId: user.id,
      });

      revalidatePath("/transactions");
    },
  );

export const deleteTransaction = authenticatedActionClient
  .schema(
    z.object({
      id: z.number(),
    }),
  )
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    await db
      .delete(transaction)
      .where(and(eq(transaction.id, id), eq(transaction.userId, user.id)));

    revalidatePath("/transactions");
  });

export const updateTransaction = authenticatedActionClient
  .schema(updateTransactionSchema)
  .action(async ({ parsedInput: { id, ...values }, ctx: { user } }) => {
    await db
      .update(transaction)
      .set({
        name: values.name,
        value: values.amount,
        created_at: dayjs(values.date).toISOString(),
        accountId: Number(values.account),
        categoryId: Number(values.category),
        transactionType: values.transactionType,
      })
      .where(and(eq(transaction.id, id), eq(transaction.userId, user.id)));

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
