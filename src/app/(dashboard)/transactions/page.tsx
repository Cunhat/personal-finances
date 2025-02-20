import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import Link from "next/link";

import Transactions from "./_components/transactions";
import { Suspense } from "react";
import NewTransaction from "./_components/new-transaction";
import { Metadata } from "next";
import PageContainer from "@/components/ui/page-container";
import UploadCsv from "./_components/upload-cvs";

export const metadata: Metadata = {
  title: "Personal Finance - Transactions",
  description: "Manage your transactions",
};

export default function Page() {
  return (
    <PageContainer>
      <PageHeader title="Transactions">
        <Button variant="outline" asChild className="ml-auto">
          <Link href="/transactions/unprocessed">
            <FileUp size={16} />
            Unprocessed
          </Link>
        </Button>
        <UploadCsv />
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
    </PageContainer>
  );
}
