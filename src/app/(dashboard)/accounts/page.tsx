import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import CreateAccount from "./_components/create-account";
import ListAccounts from "./_components/list-accounts";
import { Metadata } from "next";
import PageContainer from "@/components/ui/page-container";

export const metadata: Metadata = {
  title: "Personal Finance - Accounts",
  description: "Manage your accounts",
};

export default async function Page() {
  return (
    <PageContainer>
      <PageHeader title="Accounts">
        <CreateAccount />
      </PageHeader>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex-1 overflow-hidden">
          <ListAccounts />
        </div>
      </Suspense>
    </PageContainer>
  );
}
