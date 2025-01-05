"use server";

import { CreateTransaction } from "@/schemas/transaction";
import { UnprocessedTransactionSchema } from "@/schemas/unprocessed-transactions";
import { db } from "@/server/db";
import { transaction, unprocessedTransaction } from "@/server/db/schema";
import { authenticatedActionClient } from "@/server/safe-actions";
import dayjs from "dayjs";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateAccountBalance } from "../actions";

export const updateUnprocessedTransactionCategory = authenticatedActionClient
  .schema(
    z.object({
      categoryId: z.string(),
      transactionId: z.string(),
    }),
  )
  .action(
    async ({ parsedInput: { categoryId, transactionId }, ctx: { user } }) => {
      await db
        .update(unprocessedTransaction)
        .set({ categoryId: Number(categoryId) })
        .where(
          and(
            eq(unprocessedTransaction.id, Number(transactionId)),
            eq(unprocessedTransaction.userId, user.id),
          ),
        );
    },
  );

export const updateUnprocessedTransactionAccount = authenticatedActionClient
  .schema(
    z.object({
      accountId: z.string(),
      transactionId: z.string(),
    }),
  )
  .action(
    async ({ parsedInput: { accountId, transactionId }, ctx: { user } }) => {
      await db
        .update(unprocessedTransaction)
        .set({ accountId: Number(accountId) })
        .where(
          and(
            eq(unprocessedTransaction.id, Number(transactionId)),
            eq(unprocessedTransaction.userId, user.id),
          ),
        );
    },
  );

export const processUnprocessedTransactions = authenticatedActionClient
  .schema(z.array(UnprocessedTransactionSchema))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const transactionToProcess = parsedInput.map((transaction) => ({
      ...transaction,
      created_at: dayjs(transaction.created_at)
        .hour(dayjs().hour())
        .minute(dayjs().minute())
        .second(dayjs().second())
        .toISOString(),
      id: null,
    }));

    const processedTransactions = await db
      .insert(transaction)
      //@ts-expect-error drizzle types
      .values(transactionToProcess);

    if (processedTransactions) {
      const updatedAccountBalance: Array<{
        accountId: number;
        amount: number;
      }> = [];

      transactionToProcess.forEach((transaction) => {
        const alreadyExists = updatedAccountBalance.find(
          (acc) => acc.accountId === transaction.accountId!,
        );

        if (alreadyExists) {
          alreadyExists.amount +=
            transaction.transactionType === "income"
              ? transaction.value
              : -transaction.value;
        } else {
          updatedAccountBalance.push({
            accountId: transaction.accountId!,
            amount:
              transaction.transactionType === "income"
                ? transaction.value
                : -transaction.value,
          });
        }
      });

      await Promise.all(
        updatedAccountBalance.map(async (account) => {
          await updateAccountBalance(account.accountId, account.amount);
        }),
      );

      await db.delete(unprocessedTransaction).where(
        and(
          eq(unprocessedTransaction.userId, user.id),
          inArray(
            unprocessedTransaction.id,
            parsedInput.map((t) => t.id!),
          ),
        ),
      );
    }

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    revalidatePath("/transactions/unprocessed");
  });
