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

  const chartConfig = {
    netWorth: {
      label: "Net worth",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const dataOnLastYear = () => {
    let lastYear = dayjs().subtract(1, "year");

    const data: { month: string; netWorth: number }[] = [];

    while (lastYear.isBefore(dayjs())) {
      const transactions = account.transaction?.filter(
        (transaction) =>
          dayjs(transaction.created_at).isSame(lastYear, "month") &&
          dayjs(transaction.created_at).isSame(lastYear, "year"),
      );

      const netWorth = transactions?.reduce((acc, transaction) => {
        return acc + transaction.value;
      }, 0);

      data.push({
        month: lastYear.format("MMM YYYY"),
        netWorth: netWorth ?? 0,
      });

      lastYear = lastYear.add(1, "month");
    }
    return data;
  };

  const chartData = dataOnLastYear();

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <AccountInfoHeader account={account} />
      <div className="flex h-[150px] w-full items-center justify-center text-black">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelClassName="text-white"
                />
              }
            />
            <Area
              dataKey="netWorth"
              type="natural"
              fill="var(--color-netWorth)"
              fillOpacity={0.4}
              stroke="var(--color-netWorth)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
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
