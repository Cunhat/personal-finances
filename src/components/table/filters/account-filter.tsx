import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Column, Row } from "@tanstack/react-table";
import { Table } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import React from "react";

type AccountFilterProps = {
  column: Column<any, any>;
  table: Table<any>;
};

export function AccountFilter({ column, table }: AccountFilterProps) {
  const options = new Set<string>();
  const filterValue = new Set(column.getFilterValue() as string[]);

  table.getPreFilteredRowModel().flatRows.forEach((row) => {
    options.add(row.original.account.name);
  });

  function handleFilter(option: string) {
    if (filterValue.has(option)) {
      filterValue.delete(option);
    } else {
      filterValue.add(option);
    }

    column.setFilterValue(Array.from(filterValue));
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span>Accounts</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent alignOffset={-5} sideOffset={10}>
          {Array.from(options).map((option) => {
            return (
              <DropdownMenuItem
                key={option}
                onClick={() => handleFilter(option)}
                className="flex items-center justify-between"
              >
                <span>{option}</span>
                {filterValue.has(option) && (
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

export function AccountFilterFn(row: Row<any>, id: string, value: string[]) {
  if (value.length === 0) {
    return true;
  }

  return value.includes(row.original.account.name);
}

export function AccountFilterBadge({ column, table }: AccountFilterProps) {
  const filterValue = column.getFilterValue() as string[];

  return (
    <div className="flex gap-2">
      {filterValue?.map((value) => (
        <Badge
          variant="default"
          className="group/badge hover:cursor-pointer"
          key={value}
          onClick={() => {
            const filters = table.getState().columnFilters;

            const removedFilter = filters.find((f) => f.id === column.id);

            if (removedFilter) {
              removedFilter.value = (removedFilter.value as string[]).filter(
                (v: string) => v !== value,
              );
            }

            table.setColumnFilters(filters);
          }}
        >
          <X
            size={16}
            className="hidden group-hover/badge:inline hover:cursor-pointer"
          />
          {value}
        </Badge>
      ))}
    </div>
  );
}
