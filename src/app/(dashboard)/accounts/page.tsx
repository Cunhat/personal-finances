import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import CreateAccount from "./_components/create-account";
import ListAccounts from "./_components/list-accounts";
import AccountInfo from "./_components/account-info";

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
