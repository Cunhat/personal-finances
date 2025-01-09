import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import CreateAccount from "./_components/create-account";
import ListAccounts from "./_components/list-accounts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ accountId: string }>;
}) {
  const accountId = (await searchParams).accountId;

  console.log(accountId);

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col">
      <PageHeader title="Accounts">
        <CreateAccount />
      </PageHeader>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex-1 overflow-hidden">
          <ListAccounts accountId={accountId} />
        </div>
      </Suspense>
    </div>
  );
}
