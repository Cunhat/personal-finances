import AccountTypes from "@/app/(dashboard)/accounts/_components/accountTypes.json";
import { CardContent } from "@/components/ui/card";
import { db } from "@/server/db";
import { account } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import NetWrothAccount from "./net-wroth-account";

export default async function NetWorthListAccounts() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const accountsList = await db.query.account.findMany({
    where: eq(account.userId, user.id),
  });

  const netWorth = accountsList.reduce(
    (acc, account) => acc + account.balance,
    0,
  );

  return (
    <CardContent>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-2">
          <p className="text-lg">Net Worth</p>
          <p className="text-lg">{netWorth} €</p>
        </div>
        <div className="flex flex-col gap-6">
          {AccountTypes.map((accountType) => (
            <NetWrothAccount
              key={accountType.groupId}
              account={accountsList}
              accountType={accountType}
            />
          ))}
        </div>
      </div>
    </CardContent>
  );
}
