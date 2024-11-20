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

type ListAllProps = {
  groups: CategoryGroupWithCategories[];
  categories: CategoryWithTransactions[];
};

export default function ListAll({ groups, categories }: ListAllProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithTransactions | null>(categories[0] ?? null);

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {groups.map((group) => {
            const numberOfCategories = group?.categories?.length ?? 0;
            const color = hexToRgb(group.color, 0.35) ?? "transparent";

            return (
              <div key={group.id} className="flex items-center gap-2">
                <ChevronDown
                  size={16}
                  style={{ color: group.color ?? "white" }}
                />
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-[4px]"
                  style={{ backgroundColor: color }}
                >
                  <p style={{ color: group.color }}>{numberOfCategories}</p>
                </div>
                <p>{group.name}</p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-3 hover:cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-sm">{category.icon}</span>
              <div className="text-base">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex h-full flex-col gap-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: selectedCategory?.color }}
            className="h-2 w-2 rounded-full"
          />
          <p className="text-2xl">{selectedCategory?.icon}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">{selectedCategory?.name}</h1>
          <SetGroup groups={groups} categoryId={selectedCategory?.id ?? 0} />
        </div>
        <div className="flex flex-1 overflow-y-scroll scrollbar-none">
          <AccountExpenses
            transactions={selectedCategory?.transactions ?? []}
          />
        </div>
      </div>
    </div>
  );
}
