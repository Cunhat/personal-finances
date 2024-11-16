"use server";
import { authenticatedActionClient } from "@/server/safe-actions";
import { db } from "@/server/db";
import { category, categoryGroup } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import {
  CategoryValidationSchema,
  GroupValidationSchema,
} from "@/schemas/category";

import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { returnValidationErrors } from "next-safe-action";
import { unstable_cache } from "next/cache";

export const createCategory = authenticatedActionClient
  .schema(CategoryValidationSchema)
  .action(async ({ parsedInput: { name, icon, color }, ctx: { user } }) => {
    const existingCategory = await db.query.category.findFirst({
      where: (category, { eq, and }) =>
        and(eq(category.name, name), eq(category.userId, user.id)),
    });

    if (existingCategory) {
      returnValidationErrors(CategoryValidationSchema, {
        name: {
          _errors: ["A category with this name already exists"],
        },
      });
    }

    await db.insert(category).values({
      name,
      icon,
      color,
      userId: user.id,
    });

    revalidatePath("/categories");
  });

export const listCategories = unstable_cache(
  async (userId: string | undefined) => {
    if (!userId) {
      throw new Error("User not found");
    }

    return await db.query.category.findMany({
      where: eq(category.userId, userId),
    });
  },
  [],
  {
    tags: ["categories"],
  },
);

export const createGroup = authenticatedActionClient
  .schema(GroupValidationSchema)
  .action(async ({ parsedInput: { name, color }, ctx: { user } }) => {
    const existingGroup = await db.query.categoryGroup.findFirst({
      where: (categoryGroup, { eq, and }) =>
        and(eq(categoryGroup.name, name), eq(categoryGroup.userId, user.id)),
    });

    if (existingGroup) {
      returnValidationErrors(GroupValidationSchema, {
        name: {
          _errors: ["A group with this name already exists"],
        },
      });
    }

    await db.insert(categoryGroup).values({
      name,
      color,
      userId: user.id,
    });

    revalidatePath("/categories");
  });
