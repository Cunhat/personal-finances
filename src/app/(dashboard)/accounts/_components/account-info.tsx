import BalanceEvolutionTag from "@/components/balance-evolution-tag";
import { formatCurrency } from "@/lib/utils";
import { Account } from "@/schemas/account";
import React from "react";

type AccountInfoProps = {
  account: Account;
};

export default function AccountInfo({ account }: AccountInfoProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-lg">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">{account.name}</h1>
        <div className="ml-auto flex flex-col items-center gap-2">
          <p className="text-base">
            {formatCurrency(account.balance, {
              currency: "EUR",
              locale: "de-DE",
            })}
          </p>
          <BalanceEvolutionTag percentage={20} isIncrease={true} />
        </div>
      </div>
    </div>
  );
}
