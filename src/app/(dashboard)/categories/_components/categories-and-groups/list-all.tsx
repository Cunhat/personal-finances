"use client";

import AccountExpenses from "@/app/(dashboard)/accounts/_components/account-expenses";
import { Separator } from "@/components/ui/separator";
import { hexToRgb } from "@/lib/utils";
import {
  CategoryWithTransactions,
  CategoryGroupWithCategories,
} from "@/schemas/category";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import SetGroup from "./set-group";
import { Category } from "../categories/category";
import ExpandableGroup from "./expandable-group";
import SelectedCategory from "./selected-category";
import SelectedGroup from "./selected-group";

type ListAllProps = {
  groups: CategoryGroupWithCategories[];
  categories: CategoryWithTransactions[];
};

export default function ListAll({ groups, categories }: ListAllProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithTransactions | null>(categories[0] ?? null);
  const [selectedGroup, setSelectedGroup] =
    useState<CategoryGroupWithCategories | null>(null);

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
    <div className="grid h-full grid-cols-[1fr_1px_1fr] gap-4 overflow-hidden">
      <div className="flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {groups.map((group) => (
            <ExpandableGroup
              key={group.id}
              group={group}
              onCategorySelect={setSelectedCategory}
              onGroupSelect={setSelectedGroup}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <Category
              key={category.id}
              category={category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </div>
      <Separator orientation="vertical" />
      {selectedCategory && (
        <SelectedCategory selectedCategory={selectedCategory} groups={groups} />
      )}
      {selectedGroup && <SelectedGroup group={selectedGroup} />}
    </div>
  );
}
