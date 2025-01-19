import AccountExpenses from "@/app/(dashboard)/accounts/_components/account-expenses";
import {
  CategoryGroupWithCategories,
  CategoryWithTransactions,
} from "@/schemas/category";
import CategoryActions from "./category-actions";
import { Inbox } from "lucide-react";

type SelectedCategoryProps = {
  selectedCategory: CategoryWithTransactions;
  groups: CategoryGroupWithCategories[];
};

export default function SelectedCategory({
  selectedCategory,
  groups,
}: SelectedCategoryProps) {
  if (!selectedCategory.transactions.length) {
    return (
      <div className="flex h-full flex-col gap-4 overflow-hidden">
        <SelectedCategoryHeader
          selectedCategory={selectedCategory}
          groups={groups}
        />
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
      <SelectedCategoryHeader
        selectedCategory={selectedCategory}
        groups={groups}
      />
      <div className="flex flex-1 overflow-y-scroll scrollbar-none">
        <AccountExpenses transactions={selectedCategory?.transactions ?? []} />
      </div>
    </div>
  );
}

function SelectedCategoryHeader({
  selectedCategory,
  groups,
}: {
  selectedCategory: CategoryWithTransactions;
  groups: CategoryGroupWithCategories[];
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          style={{ backgroundColor: selectedCategory?.color }}
          className="h-2 w-2 rounded-full"
        />
        <p className="text-2xl">{selectedCategory?.icon}</p>
        <h1 className="text-2xl font-bold">{selectedCategory?.name}</h1>
      </div>
      <CategoryActions
        groups={groups}
        category={selectedCategory}
        hasGroup={selectedCategory?.groupId !== null}
      />
    </div>
  );
}
