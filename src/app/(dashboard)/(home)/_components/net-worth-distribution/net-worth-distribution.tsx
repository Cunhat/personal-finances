import { db } from "@/server/db";
import { account } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NetWorthDistributionChart from "./net-worth-distribution-chart";
import { ChartConfig } from "@/components/ui/chart";
import AccountTypes from "@/app/(dashboard)/accounts/_components/accountTypes.json";

export default async function NetWorthDistribution() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const accountsList = await db.query.account.findMany({
    where: eq(account.userId, user.id),
  });

  const netWorth = accountsList.reduce(
    (acc, account) => acc + account.balance,
    0,
  );

  const chartData: { accountType: string; netWorth: number; fill: string }[] =
    [];

  AccountTypes.forEach((accountType, index) => {
    const accounts = accountsList.filter((elem) =>
      accountType.accounts.some((account) => account.id === elem.accountType),
    );

    chartData.push({
      accountType: accountType.groupId,
      netWorth: accounts.reduce((acc, account) => acc + account.balance, 0),
      fill: `hsl(var(--chart-${index + 1}))`,
    });
  });

  const chartConfig = {
    bankAccount: {
      label: "Bank Account",
      color: "hsl(var(--chart-1))",
    },
    savingsAccount: {
      label: "Savings Account",
      color: "hsl(var(--chart-2))",
    },
    investmentAccount: {
      label: "Investment Account",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth Distribution</CardTitle>
        <CardDescription>
          Net Worth Distribution across all accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <NetWorthDistributionChart
            chartData={chartData}
            chartConfig={chartConfig}
            netWorth={netWorth}
          />
        </div>
      </CardContent>
    </Card>
  );
}
