import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { db } from "@/server/db";
import { transaction } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import IncomeVsExpensesChart from "./income-vs-expenses-chart";

export default async function IncomeVsExpenses() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const transactions = await db.query.transaction.findMany({
    where: eq(transaction.userId, user.id),
  });

  let lastYear = dayjs().subtract(1, "year");

  const chartData = [];

  while (lastYear.isBefore(dayjs())) {
    console.log(lastYear);
    const currMonthTransactions = transactions.filter((transaction) =>
      dayjs(transaction.created_at).isSame(lastYear, "month"),
    );

    const income = currMonthTransactions
      .filter((item) => item.transactionType === "income")
      .reduce((acc, transaction) => {
        return acc + transaction.value;
      }, 0);

    const expenses = currMonthTransactions
      .filter((item) => item.transactionType === "expense")
      .reduce((acc, transaction) => {
        return acc + transaction.value;
      }, 0);

    chartData.push({
      month: lastYear.format("MMM YYYY"),
      income: income ?? 0,
      expenses: expenses ?? 0,
    });

    lastYear = lastYear.add(1, "month");
  }

  const chartConfig = {
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-5))",
    },
    income: {
      label: "Income",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <IncomeVsExpensesChart
            chartData={chartData}
            chartConfig={chartConfig}
          />
        </div>
      </CardContent>
    </Card>
  );
}
