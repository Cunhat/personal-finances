import { PageHeader } from "@/components/page-header";
import {
  CategoryGroupWithCategories,
  CategoryWithTransactions,
} from "@/schemas/category";
import { db } from "@/server/db";
import { category, categoryGroup } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { Metadata } from "next";
import { unstable_cache } from "next/dist/server/web/spec-extension/unstable-cache";
import { redirect } from "next/navigation";
import ListAll from "./_components/categories-and-groups/list-all";
import CategoryActions from "./_components/category-actions";
import { SampleCategories } from "./_components/sample-categories/get-samples";

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

  const allCategories = [
    ...categories,
    ...groups.flatMap((group) => group.categories),
  ];

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden">
      <PageHeader title="Categories">
        <div className="ml-2 flex h-full w-full">
          <CategoryActions
            sampleCategories={
              <SampleCategories
                categories={allCategories as CategoryWithTransactions[]}
              />
            }
          />
        </div>
      </PageHeader>
      <ListAll
        groups={groups as CategoryGroupWithCategories[]}
        categories={categories as CategoryWithTransactions[]}
      />
    </div>
  );
}
