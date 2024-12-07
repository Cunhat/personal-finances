"use server";

import { TransactionValidationSchema } from "@/schemas/transaction";
import { authenticatedActionClient } from "@/server/safe-actions";
import { db } from "@/server/db";
import { transaction } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";

export const createTransaction = authenticatedActionClient
  .schema(TransactionValidationSchema)
  .action(
    async ({
      parsedInput: { name, amount, date, account, category },
      ctx: { user },
    }) => {
      console.log(name, amount, date, account, category);

      const createdAt = dayjs(date).toISOString();

      await db.insert(transaction).values({
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
