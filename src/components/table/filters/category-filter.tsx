import CategoryBadge from "@/components/category-badge";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/schemas/category";
import { Transaction } from "@/schemas/transaction";
import { Column, Row } from "@tanstack/react-table";
import { Table } from "@tanstack/react-table";
import { Check } from "lucide-react";
import React from "react";

type CategoryFilterProps = {
  column: Column<Transaction>;
  table: Table<Transaction>;
};

export function CategoryFilter({ column, table }: CategoryFilterProps) {
  const options = new Array<Category>();
  const filterValue = (column.getFilterValue() as Category[]) ?? [];

  table.getPreFilteredRowModel().flatRows.forEach((row) => {
    if (!options.some((category) => row.original.category.id === category.id)) {
      options.push(row.original.category);
    }
  });

  function handleFilter(option: Category) {
    if (filterValue?.some((category) => category.id === option.id)) {
      column.setFilterValue(
        filterValue.filter((category) => category.id !== option.id),
      );
    } else {
      filterValue.push(option);
      column.setFilterValue(filterValue);
    }
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span>Categories</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent alignOffset={-5} sideOffset={10}>
          {options.map((option) => {
            return (
              <DropdownMenuItem
                key={option.id}
                onClick={() => handleFilter(option)}
                className="flex items-center justify-between"
              >
                <CategoryBadge category={option} />
                {filterValue.some((category) => category.id === option.id) && (
                  <Check size={16} className="ml-2 text-white" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export function CategoryFilterFn(
  row: Row<Transaction>,
  id: string,
  value: Category[],
) {
  if (value.length === 0) {
    return true;
  }

  return value.some((category) => category.id === row.original.category.id);
}

export function CategoryFilterBadge({ column, table }: CategoryFilterProps) {
  const filterValue = (column.getFilterValue() as Category[]) ?? [];

  return (
    <div className="flex gap-2">
      {filterValue.map((category) => (
        <div
          key={category.id}
          onClick={() => {
            table.setColumnFilters([]);
          }}
          className="cursor-pointer"
        >
          <CategoryBadge key={category.id} category={category} />
        </div>
      ))}
    </div>
  );
}
