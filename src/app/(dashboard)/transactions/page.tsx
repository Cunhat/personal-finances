import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import Link from "next/link";

import Transactions from "./_components/transactions";
import { Suspense } from "react";
import NewTransaction from "./_components/new-transaction";

export default function Page() {
  return (
    <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden">
      <PageHeader title="Transactions">
        <Button variant="outline" asChild className="ml-auto">
          <Link href="/transactions/unprocessed">
            <FileUp size={16} />
            Unprocessed
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/transactions/csv-upload">
            <FileUp size={16} />
            Upload CSV
          </Link>
        </Button>
        <NewTransaction />
      </PageHeader>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            Loading...
          </div>
        }
      >
        <Transactions />
      </Suspense>
    </div>
  );
}
