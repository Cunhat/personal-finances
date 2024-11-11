"use client";

import React, { useState } from "react";
import { Account } from "@/schemas/account";
import accountTypes from "./accountTypes.json";
import AccountGroup from "./account-group";
import { Separator } from "@/components/ui/separator";
import AccountInfo from "./account-info";

type SplitAccountsViewProps = {
  accounts: Account[];
};

export default function SplitAccountsView({
  accounts,
}: SplitAccountsViewProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(
    accounts[0] ?? null,
  );

  return (
    <div className="grid flex-1 grid-cols-[1fr_1px_1fr] gap-4">
      <div>
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
              onAccountSelect={setSelectedAccount}
            />
          );
        })}
      </div>
      <Separator orientation="vertical" />
      <div>{selectedAccount && <AccountInfo account={selectedAccount} />}</div>
    </div>
  );
}
