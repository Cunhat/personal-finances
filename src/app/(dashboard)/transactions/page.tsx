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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileUp } from "lucide-react";

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
        <Button variant="outline" asChild className="ml-auto">
          <Link href="/transactions/unprocessed">
            <FileUp size={16} />
            Unprocessed
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/transactions/csv-upload">
            <FileUp size={16} />
            Upload CSV
          </Link>
        </Button>
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
