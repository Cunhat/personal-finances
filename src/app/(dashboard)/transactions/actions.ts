"use server";

import { TransactionValidationSchema } from "@/schemas/transaction";
import { authenticatedActionClient } from "@/server/safe-actions";
import { db } from "@/server/db";
import { transaction } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

export const createTransaction = authenticatedActionClient
  .schema(TransactionValidationSchema)
  .action(
    async ({
      parsedInput: { name, amount, date, account, category },
      ctx: { user },
    }) => {
      const createdAt = dayjs(date).toISOString();

      await db.insert(transaction).values({
        //@ts-expect-error drizzle types
        name,
        value: amount,
        created_at: createdAt,
        transactionType: "expense",
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
