"use client";

import React from "react";
import { CartesianGrid, XAxis, BarChart } from "recharts";
import { Bar } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type IncomeVsExpensesChartProps = {
  chartData: { month: string; expenses: number; income: number }[];
  chartConfig: ChartConfig;
};

export default function IncomeVsExpensesChart({
  chartData,
  chartConfig,
}: IncomeVsExpensesChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
