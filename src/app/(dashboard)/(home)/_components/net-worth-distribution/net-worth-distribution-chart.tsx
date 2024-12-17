"use client";
import { ChartConfig, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { ChartTooltip } from "@/components/ui/chart";
import { CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import React from "react";

type NetWorthDistributionChartProps = {
  chartData: {
    accountType: string;
    netWorth: number;
  }[];
  chartConfig: ChartConfig;
  netWorth: number;
};

export default function NetWorthDistributionChart({
  chartData,
  netWorth,
  chartConfig,
}: NetWorthDistributionChartProps) {
  return (
    <CardContent className="flex-1 pb-0">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="netWorth"
            nameKey="accountType"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {netWorth.toLocaleString()} €
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Net Worth
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </CardContent>
  );
}
