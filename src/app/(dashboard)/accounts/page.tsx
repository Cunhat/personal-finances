import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import CreateAccount from "./_components/create-account";
import ListAccounts from "./_components/list-accounts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Finance - Accounts",
  description: "Manage your accounts",
};

export default async function Page() {
  return (
    <div className="flex h-[calc(100vh-65px)] flex-col">
      <PageHeader title="Accounts">
        <CreateAccount />
      </PageHeader>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex-1 overflow-hidden">
          <ListAccounts />
        </div>
      </Suspense>
    </div>
  );
}
