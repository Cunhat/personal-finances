import { PageHeader } from "@/components/page-header";
import { Metadata } from "next";
import IncomeVsExpenses from "./(home)/_components/income-vs-expenses/income-vs-expenses";
import NetWorthWidget from "./(home)/_components/net-worth-widget";
import { Suspense } from "react";
import NetWorthDistribution from "./(home)/_components/net-worth-distribution/net-worth-distribution";
import NetWorthVariance from "./(home)/_components/net-worth-variance/net-worth-variance";
import { Card, CardContent } from "@/components/ui/card";
import PageContainer from "@/components/ui/page-container";

export const metadata: Metadata = {
  title: "Personal Finance - Dashboard",
  description: "Track your finances",
};

export default async function Page() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" />
      <div className="grid h-full grid-cols-[minmax(300px,1fr)_5fr] gap-4 overflow-hidden">
        <NetWorthWidget />
        <div className="flex flex-col gap-4 overflow-auto">
          <Suspense fallback={<NetWorthVarianceLoader />}>
            <NetWorthVariance />
          </Suspense>
          <Suspense fallback={<NetWorthVarianceLoader />}>
            <IncomeVsExpenses />
          </Suspense>
          <div className="grid grid-cols-2 gap-4">
            <Suspense fallback={<NetWorthDistributionLoader />}>
              <NetWorthDistribution />
            </Suspense>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function NetWorthVarianceLoader() {
  return (
    <Card className="h-[425px] w-full animate-pulse">
      <CardContent className="h-full w-full rounded-lg bg-neutral-800"></CardContent>
    </Card>
  );
}

function NetWorthDistributionLoader() {
  return (
    <Card className="h-[374px] w-full animate-pulse">
      <CardContent className="h-full w-full rounded-lg bg-neutral-800"></CardContent>
    </Card>
  );
}
