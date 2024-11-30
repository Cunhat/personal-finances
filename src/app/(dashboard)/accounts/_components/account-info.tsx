import BalanceEvolutionTag from "@/components/balance-evolution-tag";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Account } from "@/schemas/account";
import AccountExpenses from "./account-expenses";
import AccountActions from "./account-actions";
import { Inbox } from "lucide-react";

type AccountInfoProps = {
  account: Account;
};

export default function AccountInfo({ account }: AccountInfoProps) {
  if (!account.transaction?.length) {
    return (
      <div className="flex h-full flex-col gap-4">
        <AccountInfoHeader account={account} />
        <Separator />
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Inbox className="size-16 opacity-50" />
          <p className="text-center text-sm text-muted-foreground">
            No transactions found...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <AccountInfoHeader account={account} />
      <div className="flex h-[300px] w-full items-center justify-center bg-pink-200 text-black">
        Networth chart area
      </div>
      <Separator />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto scrollbar-none">
        <AccountExpenses transactions={account.transaction ?? []} />
      </div>
    </div>
  );
}

function AccountInfoHeader({ account }: { account: Account }) {
  return (
    <div className="flex h-auto items-center gap-2">
      <h1 className="text-3xl font-bold">{account.name}</h1>
      <div className="ml-auto flex items-center gap-2">
        <p className="text-xl">
          {formatCurrency(account.balance, {
            currency: "EUR",
            locale: "de-DE",
          })}
        </p>
        <AccountActions accountId={account.id} />
      </div>
    </div>
  );
}
