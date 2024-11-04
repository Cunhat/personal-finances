"use server";
import { authenticatedActionClient } from "@/server/safe-actions";
import { db } from "@/server/db";
import { category } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { CreateCategorySchema } from "@/schemas/category";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

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

export const listCategories = cache(async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  return await db.query.category.findMany({
    where: eq(category.userId, user.id),
  });
});
