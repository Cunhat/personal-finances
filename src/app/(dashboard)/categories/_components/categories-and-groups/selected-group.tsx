import AccountExpenses from "@/app/(dashboard)/accounts/_components/account-expenses";
import CategoryBadge from "@/components/category-badge";
import { CategoryGroupWithCategories } from "@/schemas/category";
import { category } from "@/server/db/schema";
import dayjs from "dayjs";
import React from "react";
import GroupActions from "./group-actions";
import { Inbox } from "lucide-react";

type SelectedGroupProps = {
  group: CategoryGroupWithCategories;
};

export default function SelectedGroup({ group }: SelectedGroupProps) {
  const transactions = group.categories
    .flatMap((category) => category.transactions)
    .sort((a, b) =>
      dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1,
    );

  if (!transactions.length) {
    return (
      <div className="flex h-full flex-col gap-4 overflow-hidden">
        <SelectedGroupHeader group={group} />
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Inbox className="size-16 opacity-50" />
          <p className="text-center text-sm text-muted-foreground">
            No transactions found...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <SelectedGroupHeader group={group} />
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

function SelectedGroupHeader({
  group,
}: {
  group: CategoryGroupWithCategories;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          style={{ backgroundColor: group?.color }}
          className="h-2 w-2 rounded-full"
        />
        <h1 className="text-2xl font-bold">{group?.name}</h1>
      </div>
      <GroupActions groupId={group.id} />
    </div>
  );
}
