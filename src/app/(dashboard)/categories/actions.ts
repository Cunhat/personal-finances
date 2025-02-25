"use server";
import {
  CategoryValidationSchema,
  GroupValidationSchema,
  UpdateCategorySchema,
} from "@/schemas/category";
import { db } from "@/server/db";
import { category, categoryGroup } from "@/server/db/schema";
import { authenticatedActionClient } from "@/server/safe-actions";
import { revalidatePath, revalidateTag } from "next/cache";

import { and, eq } from "drizzle-orm";
import { returnValidationErrors } from "next-safe-action";
import { unstable_cache } from "next/cache";
import { z } from "zod";

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

    revalidateTag("categories");
    revalidatePath("/categories");
  });

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
    revalidateTag("categories");
  });

export const addCategoryToGroup = authenticatedActionClient
  .schema(
    z.object({
      categoryId: z.number(),
      groupId: z.number(),
    }),
  )
  .action(async ({ parsedInput: { categoryId, groupId }, ctx: { user } }) => {
    await db
      .update(category)
      .set({
        groupId,
      })
      .where(and(eq(category.id, categoryId), eq(category.userId, user.id)));

    revalidatePath("/categories");
  });

export const removeCategoryFromGroup = authenticatedActionClient
  .schema(z.object({ categoryId: z.number() }))
  .action(async ({ parsedInput: { categoryId }, ctx: { user } }) => {
    await db
      .update(category)
      .set({ groupId: null })
      .where(and(eq(category.id, categoryId), eq(category.userId, user.id)));

    revalidatePath("/categories");
    revalidateTag("categories");
  });

export const deleteCategory = authenticatedActionClient
  .schema(z.object({ categoryId: z.number() }))
  .action(async ({ parsedInput: { categoryId }, ctx: { user } }) => {
    await db
      .delete(category)
      .where(and(eq(category.id, categoryId), eq(category.userId, user.id)));

    revalidatePath("/categories");
    revalidateTag("categories");
  });

export const deleteGroup = authenticatedActionClient
  .schema(z.object({ groupId: z.number() }))
  .action(async ({ parsedInput: { groupId }, ctx: { user } }) => {
    const group = await db.query.categoryGroup.findFirst({
      where: and(
        eq(categoryGroup.id, groupId),
        eq(categoryGroup.userId, user.id),
      ),
    });

    if (!group) {
      throw new Error("Group not found");
    }

    //Set groupId to null for all categories in the group
    await db
      .update(category)
      .set({ groupId: null })
      .where(and(eq(category.groupId, groupId), eq(category.userId, user.id)));

    await db.delete(categoryGroup).where(eq(categoryGroup.id, groupId));

    revalidatePath("/categories");
    revalidateTag("categories");
  });

export const updateCategory = authenticatedActionClient
  .schema(UpdateCategorySchema)
  .action(async ({ parsedInput: { name, icon, color, id }, ctx: { user } }) => {
    await db
      .update(category)
      .set({ name, icon, color })
      .where(and(eq(category.id, id), eq(category.userId, user.id)));

    revalidatePath("/categories");
    revalidateTag("categories");
  });
