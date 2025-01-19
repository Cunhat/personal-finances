"use client";

import { Separator } from "@/components/ui/separator";
import {
  CategoryGroupWithCategories,
  CategoryWithTransactions,
} from "@/schemas/category";
import { Inbox } from "lucide-react";
import { useQueryState } from "nuqs";
import { Category } from "../categories/category";
import ExpandableGroup from "./expandable-group";
import SelectedCategory from "./selected-category";
import SelectedGroup from "./selected-group";

type ListAllProps = {
  groups: CategoryGroupWithCategories[];
  categories: CategoryWithTransactions[];
};

export default function ListAll({ groups, categories }: ListAllProps) {
  const [selectedCategoryId, setSelectedCategoryId] =
    useQueryState("categoryId");
  const [selectedGroupId, setSelectedGroupId] = useQueryState("groupId");

  const selectedCategory = categories.find(
    (category) => category.id === Number(selectedCategoryId),
  );
  const selectedGroup = groups.find(
    (group) => group.id === Number(selectedGroupId),
  );

  if (categories.length === 0 && groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-base font-bold">No categories...</h1>
        <p className="text-sm text-muted-foreground">
          Create a category to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[1fr_1px_3fr] gap-4 overflow-hidden">
      <div className="flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {groups.map((group) => (
            <ExpandableGroup key={group.id} group={group} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <Category key={category.id} category={category} />
          ))}
        </div>
      </div>
      <Separator orientation="vertical" />
      {!selectedCategoryId && !selectedGroupId && (
        <div className="flex flex-col items-center justify-center gap-2">
          <Inbox className="size-16 opacity-50" />
          <h1 className="text-base font-bold">No Group or Category selected</h1>
          <p className="text-sm text-muted-foreground">
            Select a Group or Category to view its transactions
          </p>
        </div>
      )}
      {selectedCategory && (
        <SelectedCategory selectedCategory={selectedCategory} groups={groups} />
      )}
      {selectedGroup && <SelectedGroup group={selectedGroup} />}
    </div>
  );
}
