"use server";

import {
  TransactionValidationSchema,
  updateTransactionSchema,
} from "@/schemas/transaction";
import { db } from "@/server/db";
import { account, category, transaction } from "@/server/db/schema";
import { authenticatedActionClient } from "@/server/safe-actions";
import dayjs from "dayjs";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";

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
      const createdAt = dayjs(date)
        .hour(dayjs().hour())
        .minute(dayjs().minute())
        .second(dayjs().second())
        .toISOString();

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

// export const generateTransactions = authenticatedActionClient.action(
//   async ({ ctx: { user } }) => {
//     // Get existing accounts and categories
//     const { accounts, categories } = await getAccountsAndCategories(user.id);

//     if (!accounts.length || !categories.length) {
//       throw new Error("No accounts or categories found");
//     }

//     // Split categories by type to ensure proper category assignment
//     // const expenseCategories = categories.filter((c) => c.groupId === 1);
//     // const incomeCategories = categories.filter((c) => c.groupId === 2);

//     // if (!expenseCategories.length || !incomeCategories.length) {
//     //   throw new Error("Need at least one category of each type");
//     // }

//     const transactions = generateRandomTransactions({
//       accountIds: [17, 18, 19],
//       categoryIds: categories.map((cat) => cat.id),
//       userId: user.id,
//       // Pass categories by type to ensure proper matching
//       expenseCategoryIds: categories.map((cat) => cat.id),
//       incomeCategoryIds: categories.map((cat) => cat.id),
//     });

//     console.log(transactions);

//     // Insert transactions in batches
//     const BATCH_SIZE = 50;
//     for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
//       const batch = transactions.slice(i, i + BATCH_SIZE);
//       await db.insert(transaction).values(batch);
//     }

//     // Update account balances
//     for (const acc of accounts) {
//       const accountTransactions = transactions.filter(
//         (t) => t.accountId === acc.id,
//       );
//       const balance = accountTransactions.reduce(
//         (sum, t) => sum + (t.transactionType === "income" ? t.value : -t.value),
//         0,
//       );

//       await db
//         .update(account)
//         .set({
//           balance: sql`${account.balance} + ${balance}`,
//         })
//         .where(eq(account.id, acc.id));
//     }

//     revalidatePath("/transactions");
//     revalidateTag("transactions");
//   },
// );
