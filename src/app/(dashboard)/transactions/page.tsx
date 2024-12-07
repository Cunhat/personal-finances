import { PageHeader } from "@/components/page-header";
import { db } from "@/server/db";
import React from "react";
import { unstable_cache } from "next/cache";
import { transaction } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import ListTransactions from "./_components/list-transactions";
import NewTransactionSheet from "./_components/new-transaction-sheet";
import NewTransaction from "./_components/new-transaction";

const getAllTransactions = unstable_cache(
  async (userId: string) => {
    const transactions = await db.query.transaction.findMany({
      where: eq(transaction.userId, userId),
      with: {
        category: true,
        account: true,
      },
    });
    return transactions;
  },
  ["transactions"],
);

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const transactions = await getAllTransactions(user.id);

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden">
      <PageHeader title="Transactions">
        <NewTransaction />
      </PageHeader>
      <ListTransactions transactions={transactions} />
    </div>
  );
}
