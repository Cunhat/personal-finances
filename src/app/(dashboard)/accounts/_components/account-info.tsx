import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Account } from "@/schemas/account";
import dayjs from "dayjs";
import { Inbox } from "lucide-react";
import { Area, AreaChart, XAxis } from "recharts";
import AccountActions from "./account-actions";
import AccountExpenses from "./account-expenses";
import { AccountNetWorthChart } from "./account-net-worth-chart";
import AccountTransactionsChart from "./account-transactions-chart";

type AccountInfoProps = {
  account: Account;
  selectedAccountNetWorth: {
    account: string;
    accountId: number;
    netWorth: { date: string; value: number }[];
  };
};

export default function AccountInfo({
  account,
  selectedAccountNetWorth,
}: AccountInfoProps) {
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

  const chartConfig = {
    netWorth: {
      label: "Net worth",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const test = [
    {
      month: "Jan",
      expenses: 100,
      income: 200,
    },
  ];

  const dataOnLastYear = () => {
    let lastYear = dayjs().subtract(1, "year");

    const data: { month: string; expenses: number; income: number }[] = [];

    while (lastYear.isBefore(dayjs())) {
      const transactions = account.transaction?.filter(
        (transaction) =>
          dayjs(transaction.created_at).isSame(lastYear, "month") &&
          dayjs(transaction.created_at).isSame(lastYear, "year"),
      );

      const income = transactions
        ?.filter((transaction) => transaction.transactionType === "income")
        .reduce((acc, transaction) => {
          return acc + transaction.value;
        }, 0);

      const expenses = transactions
        ?.filter((transaction) => transaction.transactionType === "expense")
        .reduce((acc, transaction) => {
          return acc + transaction.value;
        }, 0);

      data.push({
        month: lastYear.format("MMM YYYY"),
        expenses: expenses ?? 0,
        income: income ?? 0,
      });

      lastYear = lastYear.add(1, "month");
    }
    return data;
  };

  const chartData = dataOnLastYear();

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <AccountInfoHeader account={account} />
      <AccountNetWorthChart data={selectedAccountNetWorth.netWorth} />
      <AccountTransactionsChart data={chartData} />
      <Separator />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto scrollbar-none">
        <AccountExpenses
          initialBalance={account.initialBalance}
          transactions={account.transaction ?? []}
        />
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
