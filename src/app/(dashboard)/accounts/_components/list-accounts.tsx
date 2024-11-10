import { db } from "@/server/db";
import { account } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import AccountGroup from "./account-group";
import accountTypes from "./accountTypes.json";
import { unstable_cache } from "next/cache";

const getAccounts = unstable_cache(async (userId: string) => {
  return await db.query.account.findMany({
    where: eq(account.userId, userId),
  });
});

export default async function ListAccounts() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const accounts = await getAccounts(user.id);

  return (
    <div className="flex flex-col gap-4">
      {accountTypes.map((accountType) => {
        const flattenedGroupAccounts = accountType.accounts.map(
          (account) => account.id,
        );

        const accountsInGroup = accounts.filter((account) =>
          flattenedGroupAccounts.includes(account.accountType),
        );

        if (!accountsInGroup.length) return null;

        return (
          <AccountGroup
            key={accountType.groupId}
            groupName={accountType.name}
            accounts={accountsInGroup}
          />
        );
      })}
    </div>
  );
}
