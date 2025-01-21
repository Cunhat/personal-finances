import { PageHeader } from "@/components/page-header";
import ListUnprocessedTransactions from "./list-unprocessed-transactions";
import { Suspense } from "react";
import PageContainer from "@/components/ui/page-container";

export default function Unprocessed() {
  return (
    <PageContainer>
      <PageHeader title="Unprocessed Transactions" />
      <Suspense fallback={<div>Loading...</div>}>
        <ListUnprocessedTransactions />
      </Suspense>
    </PageContainer>
  );
}
