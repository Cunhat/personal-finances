import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import CreateAccount from "./_components/create-account";
import ListAccounts from "./_components/list-accounts";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Accounts">
        <CreateAccount />
      </PageHeader>
      <div className="grid flex-1 grid-cols-[1fr_1px_1fr] gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <ListAccounts />
        </Suspense>
        <Separator orientation="vertical" />
        <div className="flex flex-1 flex-col gap-4"></div>
      </div>
    </div>
  );
}
