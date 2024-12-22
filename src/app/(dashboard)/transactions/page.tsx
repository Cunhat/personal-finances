import { PageHeader } from "@/components/page-header";
import { db } from "@/server/db";
import { transaction } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import ListTransactions from "./_components/list-transactions";
import NewTransaction from "./_components/new-transaction";
import { getAccountsAndCategories } from "./actions";

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
  {
    revalidate: 5,
  },
);

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const transactions = await getAllTransactions(user.id);
  const { accounts, categories } = await getAccountsAndCategories(user.id);

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden">
      <PageHeader title="Transactions">
        <NewTransaction />
      </PageHeader>
      <ListTransactions
        accounts={accounts}
        categories={categories}
        transactions={transactions}
      />
    </div>
  );
}
