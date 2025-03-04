"use server";

import { db } from "@/server/db";
import { authenticatedActionClient } from "@/server/safe-actions";
import { z } from "zod";
import { recurringTransaction } from "@/server/db/schema";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export const createRecurring = authenticatedActionClient
  .schema(
    z.object({
      name: z.string(),
      value: z.number(),
      interval: z.string(),
      firstOccurrence: z.date(),
      category: z.string(),
    }),
  )
  .action(
    async ({
      parsedInput: { name, value, interval, firstOccurrence, category },
      ctx: { user },
    }) => {
      await db.insert(recurringTransaction).values({
        name,
        value,
        interval,
        firstOccurrence: firstOccurrence.toISOString(),
        categoryId: Number(category),
        userId: user.id,
        created_at: dayjs().toISOString(),
      });

      revalidatePath("/recurring");
    },
  );
