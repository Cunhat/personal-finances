"use server";

import { authenticatedActionClient } from "@/server/safe-actions";
import { db } from "@/server/db";
import { category } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { CreateCategorySchema } from "@/schemas/category";

export const createCategory = authenticatedActionClient
  .schema(CreateCategorySchema)
  .action(async ({ parsedInput: { name, icon, color }, ctx: { user } }) => {
    await db.insert(category).values({
      name,
      icon,
      color,
      userId: user.id,
    });

    revalidatePath("/categories");
  });
