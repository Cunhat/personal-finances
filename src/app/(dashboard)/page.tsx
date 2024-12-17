import { PageHeader } from "@/components/page-header";
import { Metadata } from "next";
import IncomeVsExpenses from "./(home)/_components/income-vs-expenses/income-vs-expenses";
import NetWorthWidget from "./(home)/_components/net-worth-widget";
import { Suspense } from "react";
import NetWorthDistribution from "./(home)/_components/net-worth-distribution/net-worth-distribution";

export const metadata: Metadata = {
  title: "Personal Finance - Dashboard",
  description: "Track your finances",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function Page() {
  return (
    <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden">
      <PageHeader title="Dashboard"></PageHeader>
      <div className="grid h-full grid-cols-[minmax(300px,1fr)_5fr] gap-4">
        <NetWorthWidget />
        <div className="flex flex-col gap-4">
          <Suspense fallback={<div>Loading...</div>}>
            <IncomeVsExpenses />
          </Suspense>
          <div className="grid grid-cols-2 gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <NetWorthDistribution />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
