"use client";
import { formatCurrency } from "@/lib/utils";
import { Account } from "@/schemas/account";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface NetWrothAccountProps {
  account: Account[];
  accountType: {
    name: string;
    accounts: {
      id: string;
      name: string;
      description: string;
    }[];
  };
}

export default function NetWrothAccount({
  account,
  accountType,
}: NetWrothAccountProps) {
  const filteredAccounts = account.filter((item) =>
    accountType.accounts.some((account) => account.id === item.accountType),
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-lg">{accountType.name}</p>
      </div>
      <div className="flex flex-col gap-2 pl-6">
        {filteredAccounts.map((account) => (
          <div key={account.id} className="flex justify-between">
            <p>{account.name}</p>
            <p>
              {formatCurrency(account.balance, {
                currency: "EUR",
                locale: "de-DE",
              })}
            </p>
          </div>
        ))}
        {filteredAccounts.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No accounts found...
          </p>
        )}
      </div>
    </div>
  );
}
