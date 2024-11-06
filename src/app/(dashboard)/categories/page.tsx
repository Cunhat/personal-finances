import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Metadata } from "next";
import { Suspense } from "react";
import CategoryActions from "./_components/category-actions";
import { ListCategories } from "./_components/list-categories";
import ListGroups from "./_components/list-groups";
import { SampleCategories } from "./_components/sample-categories/get-samples";

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
          <CategoryActions
            sampleCategories={
              <Suspense
                fallback={
                  <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                }
              >
                <SampleCategories />
              </Suspense>
            }
          />
        </div>
      </PageHeader>
      <div className="grid flex-1 grid-cols-[1fr_1px_1fr] gap-4">
        <div className="flex flex-col gap-4">
          <Suspense fallback={<div>Loading...</div>}>
            <ListGroups />
            <ListCategories />
          </Suspense>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-1 flex-col gap-4"></div>
      </div>
    </div>
  );
}
