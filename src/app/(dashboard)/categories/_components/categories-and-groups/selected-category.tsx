import AccountExpenses from "@/app/(dashboard)/accounts/_components/account-expenses";
import {
  CategoryGroupWithCategories,
  CategoryWithTransactions,
} from "@/schemas/category";
import CategoryActions from "./category-actions";

type SelectedCategoryProps = {
  selectedCategory: CategoryWithTransactions;
  groups: CategoryGroupWithCategories[];
};

export default function SelectedCategory({
  selectedCategory,
  groups,
}: SelectedCategoryProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
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
          categoryId={selectedCategory?.id ?? 0}
          hasGroup={selectedCategory?.groupId !== null}
        />
      </div>
      <div className="flex flex-1 overflow-y-scroll scrollbar-none">
        <AccountExpenses transactions={selectedCategory?.transactions ?? []} />
      </div>
    </div>
  );
}
