import React from "react";
import NewTransactionSheet from "./new-transaction-sheet";
import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { account, category } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const getAccountsAndCategories = unstable_cache(
  async (userId: string) => {
    const accountsQuery = db.query.account.findMany({
      where: eq(account.userId, userId),
    });

    const categoriesQuery = db.query.category.findMany({
      where: eq(category.userId, userId),
    });

    const [accounts, categories] = await Promise.all([
      accountsQuery,
      categoriesQuery,
    ]);

    return { accounts, categories };
  },
  ["accounts", "categories"],
);

export default async function NewTransaction() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { accounts, categories } = await getAccountsAndCategories(user.id);

  return <NewTransactionSheet accounts={accounts} categories={categories} />;
}
