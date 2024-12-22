"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import dayjs from "dayjs";

const chartConfig = {
  value: {
    label: "Net worth",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AccountNetWorthChart({
  data,
}: {
  data: { date: string; value: number }[];
}) {
  return (
    <ChartContainer config={chartConfig} className="h-[150px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => dayjs(value).format("MMM")}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent indicator="dot" labelClassName="text-white" />
          }
        />
        <Area
          dataKey="value"
          type="natural"
          fill="var(--color-value)"
          fillOpacity={0.4}
          stroke="var(--color-value)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
