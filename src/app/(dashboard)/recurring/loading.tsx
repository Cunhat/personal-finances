import { PageHeader } from "@/components/page-header";
import PageContainer from "@/components/ui/page-container";
import { Loader, Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <PageContainer>
      <PageHeader title="Recurring"></PageHeader>
      <div className="flex h-full w-full items-center justify-center">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    </PageContainer>
  );
}
