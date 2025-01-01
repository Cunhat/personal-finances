"use server";

import { db } from "@/server/db";
import { unprocessedTransaction } from "@/server/db/schema";
import { authenticatedActionClient } from "@/server/safe-actions";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

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
