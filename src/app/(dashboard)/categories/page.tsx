import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Metadata } from "next";
import { Suspense } from "react";
import CategoryActions from "./_components/category-actions";
import ListGroups from "./_components/list-groups";
import { SampleCategories } from "./_components/sample-categories/get-samples";
import { ListCategories } from "./_components/categories/list-categories";
import ListAll from "./_components/categories-and-groups/list-all";
import { unstable_cache } from "next/dist/server/web/spec-extension/unstable-cache";
import { db } from "@/server/db";
import { category, categoryGroup } from "@/server/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { promise } from "zod";

export const metadata: Metadata = {
  title: "Personal Finance - Categories",
  description: "Manage your categories",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const getGroupsAndCategories = unstable_cache(
  async (userId: string) => {
    const groupsQuery = db.query.categoryGroup.findMany({
      where: eq(categoryGroup.userId, userId),
      with: {
        categories: {
          with: {
            transactions: {
              with: {
                category: true,
              },
            },
          },
        },
      },
    });

    const categoriesQuery = db.query.category.findMany({
      where: and(eq(category.userId, userId), isNull(category.groupId)),
      with: {
        transactions: {
          with: {
            category: true,
          },
        },
      },
    });

    const [groups, categories] = await Promise.all([
      groupsQuery,
      categoriesQuery,
    ]);

    return { groups, categories };
  },
  [],
  {
    tags: ["categories-groups"],
  },
);

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { groups, categories } = await getGroupsAndCategories(user.id);

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
      <ListAll groups={groups} categories={categories} />
    </div>
  );
}
