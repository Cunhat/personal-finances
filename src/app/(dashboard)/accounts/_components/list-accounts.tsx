import { db } from "@/server/db";
import { account } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import SplitAccountsView from "./split-accounts-view";

const getAccounts = unstable_cache(async (userId: string) => {
  return await db.query.account.findMany({
    where: eq(account.userId, userId),
    with: {
      transaction: true,
    },
  });
});

export default async function ListAccounts() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const accounts = await getAccounts(user.id);

  console.log(accounts);

  if (!accounts.length) {
    return <div>No accounts found</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <SplitAccountsView accounts={accounts} />
    </div>
  );
}
