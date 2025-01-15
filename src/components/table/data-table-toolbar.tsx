"use client";

import { Column, FilterMeta, Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { ListFilter, SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface CustomFilterMeta extends FilterMeta {
  filterComponent: (info: {
    column: Column<any, any>;
    table: Table<any>;
  }) => JSX.Element;
  filterLabel: string;
  showActiveFilter: (info: {
    column: Column<any, any>;
    table: Table<any>;
  }) => JSX.Element;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const listOfFilters = table.getState().columnFilters;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    table.setGlobalFilter(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex w-[300px] items-center gap-2 rounded-md border px-2">
        <SearchIcon size={20} className="text-muted-foreground" />
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="border-none p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ListFilter
              size={20}
              className="text-muted-foreground hover:cursor-pointer hover:text-primary"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className="w-[300px]"
            sideOffset={20}
            alignOffset={-10}
            align="end"
          >
            {table.getAllColumns().map(
              (column) =>
                column.getCanFilter() &&
                column.columnDef.meta &&
                (column.columnDef.meta as CustomFilterMeta)
                  ?.filterComponent && (
                  <div key={column.id}>
                    {(
                      column.columnDef.meta as CustomFilterMeta
                    ).filterComponent({
                      column: column,
                      table,
                    })}
                  </div>
                ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2">
        {table.getAllColumns().map(
          (column) =>
            column.getCanFilter() &&
            column.columnDef.meta &&
            (column.columnDef.meta as CustomFilterMeta)?.showActiveFilter && (
              <div key={column.id}>
                {(column.columnDef.meta as CustomFilterMeta).showActiveFilter({
                  column: column,
                  table,
                })}
              </div>
            ),
        )}
      </div>
      {/* <div className="flex gap-2">
        {listOfFilters.map((filter) => {
          return filter?.value?.map((value: string) => {
            return (
              <Badge variant="default" className="group/badge">
                <X
                  size={16}
                  className="hidden group-hover/badge:inline hover:cursor-pointer"
                  onClick={() => {
                    const filters = table.getState().columnFilters;

                    const removedFilter = filters.find(
                      (f) => f.id === filter.id,
                    );

                    if (removedFilter) {
                      removedFilter.value = removedFilter.value.filter(
                        (v: string) => v !== value,
                      );
                    }

                    table.setColumnFilters(filters);
                  }}
                />
                {value}
              </Badge>
            );
          });
        })}
      </div> */}
    </div>
  );
}
