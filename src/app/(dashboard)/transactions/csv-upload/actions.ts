"use server";

import { UnprocessedTransactionSchema } from "@/schemas/unprocessed-transactions";
import { db } from "@/server/db";
import { UnprocessedTransaction } from "@/server/db/schema";
import { authenticatedActionClient } from "@/server/safe-actions";
import { z } from "zod";

export const createUnprocessedTransactions = authenticatedActionClient
  .schema(z.array(UnprocessedTransactionSchema))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const unprocessedTransactions = await db
      .insert(UnprocessedTransaction)
      .values(parsedInput);
  });
