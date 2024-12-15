import { PageHeader } from "@/components/page-header";
import { db } from "@/server/db";
import { Metadata } from "next";
import NetWorthWidget from "./(home)/_components/net-worth-widget";
import { Suspense } from "react";

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
        <div className="flex flex-col gap-4 bg-pink-300"></div>
      </div>
    </div>
  );
}
