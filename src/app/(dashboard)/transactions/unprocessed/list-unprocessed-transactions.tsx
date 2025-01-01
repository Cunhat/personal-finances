import { db } from "@/server/db";
import { account, category, unprocessedTransaction } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import UnprocessedTransactionsTable from "./unprocessed-transactions-table";

export default async function ListUnprocessedTransactions() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const unprocessedTransactionsQuery = db.query.unprocessedTransaction.findMany(
    {
      where: eq(unprocessedTransaction.userId, user.id),
    },
  );

  const accountsQuery = db.query.account.findMany({
    where: eq(account.userId, user.id),
  });

  const categoriesQuery = db.query.category.findMany({
    where: eq(category.userId, user.id),
  });

  const [unprocessedTransactions, accounts, categories] = await Promise.all([
    unprocessedTransactionsQuery,
    accountsQuery,
    categoriesQuery,
  ]);

  return (
    <UnprocessedTransactionsTable
      data={unprocessedTransactions}
      accounts={accounts}
      categories={categories}
    />
  );
}
