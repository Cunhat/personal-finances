import { Account } from "@/schemas/account";
import { Category } from "@/schemas/category";
import { Transaction } from "@/schemas/transaction";
import { db } from "@/server/db";
import { transaction } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { getAccountsAndCategories } from "../actions";
import ListTransactions from "./list-transactions";

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
  // {
  //   revalidate: 5,
  // },
);

type TransactionsProps = {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
};

export default async function Transactions() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const transactions = await getAllTransactions(user.id);
  const { accounts, categories } = await getAccountsAndCategories(user.id);

  return (
    <ListTransactions
      accounts={accounts}
      categories={categories}
      transactions={transactions}
    />
  );
}
