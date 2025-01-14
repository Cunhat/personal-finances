import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Column, Row } from "@tanstack/react-table";
import { Table } from "@tanstack/react-table";
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
              >
                <span>{option}</span>
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
