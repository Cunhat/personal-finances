import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Transaction } from "@/schemas/transaction";
import { Column, Row, Table } from "@tanstack/react-table";
import dayjs from "dayjs";

import isBetween from "dayjs/plugin/isBetween";
import { X } from "lucide-react";

dayjs.extend(isBetween);

type DateFilterProps = {
  column: Column<any, any>;
  table: Table<any>;
};

export function DateFilter({ column, table }: DateFilterProps) {
  const filterValue = (column.getFilterValue() as { from: Date; to: Date }) ?? {
    from: null,
    to: null,
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span>Date</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent alignOffset={-5} sideOffset={10}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={filterValue.from}
            selected={filterValue}
            onSelect={column.setFilterValue}
            numberOfMonths={1}
            disabled={{
              after: new Date(),
            }}
          />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
export function DateFilterFn(
  row: Row<Transaction>,
  id: string,
  value: { from: Date | null; to: Date | null },
) {
  if (value.from === null && value.to === null) {
    return true;
  }

  const rowDate = dayjs(row.original.created_at).startOf("day");

  if (
    value.from &&
    !value.to &&
    (rowDate.isAfter(value.from) || rowDate.isSame(value.from, "day"))
  ) {
    return true;
  }

  if (
    value.to &&
    value.from &&
    rowDate.isBetween(value.from, value.to, "day", "[]")
  ) {
    return true;
  }

  return false;
}

export function DateFilterBadge({ column, table }: DateFilterProps) {
  const filterValue = (column.getFilterValue() as { from: Date; to: Date }) ?? {
    from: null,
    to: null,
  };

  if (filterValue.from === null && filterValue.to === null) {
    return null;
  }

  return (
    <Badge
      variant="default"
      className="group/badge hover:cursor-pointer"
      onClick={() => {
        table.setColumnFilters([]);
      }}
    >
      <X
        size={16}
        className="hidden group-hover/badge:inline hover:cursor-pointer"
      />
      {filterValue.from && dayjs(filterValue.from).format("DD/MM/YYYY")}
      {filterValue.from && filterValue.to && " - "}
      {filterValue.to && dayjs(filterValue.to).format("DD/MM/YYYY")}
    </Badge>
  );
}
