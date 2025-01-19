"use client";

import React, { useState } from "react";
import { Account } from "@/schemas/account";
import accountTypes from "./accountTypes.json";
import AccountGroup from "./account-group";
import { Separator } from "@/components/ui/separator";
import AccountInfo from "./account-info";
import { getAccountsNetWorth } from "./utils";
import dayjs from "dayjs";
import { useQueryState } from "nuqs";
import { Inbox } from "lucide-react";

type SplitAccountsViewProps = {
  accounts: Account[];
};

export default function SplitAccountsView({
  accounts,
}: SplitAccountsViewProps) {
  const [accountId] = useQueryState("accountId");

  const selectedAccount = accountId
    ? accounts.find((account) => account.id === Number(accountId))
    : undefined;

  const netWorthByAccount: {
    account: string;
    accountId: number;
    netWorth: { date: string; value: number }[];
  }[] = getAccountsNetWorth(accounts).map((elem) => {
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
    <div className="grid h-full grid-cols-[1fr_1px_2fr] gap-4 overflow-hidden">
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
            />
          );
        })}
      </div>
      <Separator orientation="vertical" />
      {!selectedAccount && (
        <div className="flex flex-col items-center justify-center gap-2">
          <Inbox className="size-16 opacity-50" />
          <h1 className="text-base font-bold">No Account selected</h1>
          <p className="text-sm text-muted-foreground">
            Select an account to view its details
          </p>
        </div>
      )}
      {selectedAccount && (
        <AccountInfo
          account={selectedAccount}
          selectedAccountNetWorth={selectedAccountNetWorth!}
        />
      )}
    </div>
  );
}
