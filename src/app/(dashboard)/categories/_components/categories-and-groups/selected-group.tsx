import AccountExpenses from "@/app/(dashboard)/accounts/_components/account-expenses";
import CategoryBadge from "@/components/category-badge";
import { CategoryGroupWithCategories } from "@/schemas/category";
import { category } from "@/server/db/schema";
import dayjs from "dayjs";
import React from "react";

type SelectedGroupProps = {
  group: CategoryGroupWithCategories;
};

export default function SelectedGroup({ group }: SelectedGroupProps) {
  const transactions = group.categories
    .flatMap((category) => category.transactions)
    .sort((a, b) =>
      dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1,
    );

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: group?.color }}
            className="h-2 w-2 rounded-full"
          />
          <h1 className="text-2xl font-bold">{group?.name}</h1>
        </div>
      </div>
      <div className="flex gap-2">
        {group.categories.map((category) => (
          <CategoryBadge key={category.id} category={category} />
        ))}
      </div>
      <div className="flex flex-1 overflow-y-scroll scrollbar-none">
        <AccountExpenses transactions={transactions ?? []} />
      </div>
    </div>
  );
}
