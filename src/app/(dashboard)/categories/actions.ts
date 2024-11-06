"use server";
import { authenticatedActionClient } from "@/server/safe-actions";
import { db } from "@/server/db";
import { category, categoryGroup } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { CreateCategorySchema, CreateGroupSchema } from "@/schemas/category";
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

export const createGroup = authenticatedActionClient
  .schema(CreateGroupSchema)
  .action(async ({ parsedInput: { name, color }, ctx: { user } }) => {
    await db.insert(categoryGroup).values({
      name,
      color,
      userId: user.id,
    });

    revalidatePath("/categories");
  });
