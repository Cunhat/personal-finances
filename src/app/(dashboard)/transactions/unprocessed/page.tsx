import { PageHeader } from "@/components/page-header";
import ListUnprocessedTransactions from "./list-unprocessed-transactions";
import { Suspense } from "react";

export default function Unprocessed() {
  return (
    <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden">
      <PageHeader title="Unprocessed Transactions" />
      <Suspense fallback={<div>Loading...</div>}>
        <ListUnprocessedTransactions />
      </Suspense>
    </div>
  );
}
