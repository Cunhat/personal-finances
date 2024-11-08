import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import React from "react";
import CreateAccount from "./_components/create-account";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { account } from "@/server/db/schema";
import accountTypes from "./_components/accountTypes.json";
import AccountGroup from "./_components/account-group";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const accounts = await db.query.account.findMany({
    where: eq(account.userId, user.id),
  });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Accounts">
        <CreateAccount />
      </PageHeader>
      <div className="grid flex-1 grid-cols-[1fr_1px_1fr] gap-4">
        <div className="flex flex-col gap-4">
          {accountTypes.map((accountType) => {
            const flattenedGroupAccounts = accountType.accounts.map(
              (account) => account.id,
            );

            return (
              <AccountGroup
                key={accountType.groupId}
                groupName={accountType.name}
                accounts={accounts.filter((account) =>
                  flattenedGroupAccounts.includes(account.accountType),
                )}
              />
            );
          })}
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-1 flex-col gap-4"></div>
      </div>
    </div>
  );
}
