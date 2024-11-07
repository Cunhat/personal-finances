import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import React from "react";
import CreateAccount from "./_components/create-account";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Accounts">
        <CreateAccount />
      </PageHeader>
      <div className="grid flex-1 grid-cols-[1fr_1px_1fr] gap-4">
        <div className="flex flex-col gap-4"></div>
        <Separator orientation="vertical" />
        <div className="flex flex-1 flex-col gap-4"></div>
      </div>
    </div>
  );
}
