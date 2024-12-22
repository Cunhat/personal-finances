"use client";

import React, { useState } from "react";
import { Account } from "@/schemas/account";
import accountTypes from "./accountTypes.json";
import AccountGroup from "./account-group";
import { Separator } from "@/components/ui/separator";
import AccountInfo from "./account-info";
import { getAccountsNetWorthVariance } from "./utils";
import dayjs from "dayjs";

type SplitAccountsViewProps = {
  accounts: Account[];
};

export default function SplitAccountsView({
  accounts,
}: SplitAccountsViewProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(
    accounts[0] ?? null,
  );

  const netWorthByAccount: {
    account: string;
    accountId: number;
    netWorth: { date: string; value: number }[];
  }[] = getAccountsNetWorthVariance(accounts).map((elem) => {
    return {
      ...elem,
      netWorth: elem.netWorth.map((item) => ({
        ...item,
        date: dayjs(item.date).format("MMM YYYY"),
      })),
    };
  });

  const selectedAccountNetWorth = netWorthByAccount.find(
    (account) => account.accountId === selectedAccount?.id,
  );

  return (
    <div className="grid h-full grid-cols-[1fr_1px_1fr] gap-4 overflow-hidden">
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
      {selectedAccount && (
        <AccountInfo
          account={selectedAccount}
          selectedAccountNetWorth={selectedAccountNetWorth!}
        />
      )}
    </div>
  );
}
