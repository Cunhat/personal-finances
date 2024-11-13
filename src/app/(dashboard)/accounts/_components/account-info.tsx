import BalanceEvolutionTag from "@/components/balance-evolution-tag";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Account } from "@/schemas/account";
import { generateTransactions } from "./script";
import AccountExpenses from "./account-expenses";

type AccountInfoProps = {
  account: Account;
};

export default function AccountInfo({ account }: AccountInfoProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden rounded-lg">
      <div className="flex h-auto items-center gap-2">
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
      <div className="flex h-[300px] w-full items-center justify-center bg-pink-200 text-black">
        Networth chart area
      </div>
      <Separator />
      <div className="scrollbar-none flex flex-1 flex-col gap-2 overflow-y-auto">
        <AccountExpenses transactions={account.transaction ?? []} />
      </div>
      {/* <div className="scrollbar-none flex flex-1 flex-col gap-2 overflow-y-auto">
        {account.transaction?.map((transaction) => (
          <div key={transaction.id} className="flex gap-2">
            <p>{transaction.name}</p>
            <p>{transaction.value}</p>
            <p>{transaction.created_at}</p>
          </div>
        ))} */}
    </div>
  );
}
