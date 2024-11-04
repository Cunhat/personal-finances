import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import CreateCategory from "./_components/create-category";
import { ListCategories } from "./list-categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Finance - Categories",
  description: "Manage your categories",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Categories">
        <div className="ml-2 flex h-full w-full">
          <CreateCategory />
        </div>
      </PageHeader>
      <div className="grid flex-1 grid-cols-[1fr_1px_1fr] gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <ListCategories />
        </Suspense>
        <Separator orientation="vertical" />
        <div className="flex flex-1 flex-col gap-4"></div>
      </div>
    </div>
  );
}
