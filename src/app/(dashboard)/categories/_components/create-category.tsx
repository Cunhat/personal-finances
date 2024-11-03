"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import CreateCategoryForm from "./create-category-form";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Plus } from "lucide-react";
import sampleCategories from "./sampleCategories.json";

export default function CreateCategory() {
  return (
    <Sheet>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={4}>
          <DropdownMenuLabel>Categories Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Plus />
                <span>Add Category</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="max-h-[500px] overflow-y-auto">
                  <DropdownMenuItem>
                    <SheetTrigger asChild>
                      <span>New from scratch...</span>
                    </SheetTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {sampleCategories.map((category) => (
                    <DropdownMenuItem key={category.id}>
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Plus />
              Add Group
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Create Category</SheetTitle>
          <SheetDescription>
            Add a new category to organize and track your transactions.
            Categories help you understand your spending patterns.
          </SheetDescription>
        </SheetHeader>
        <CreateCategoryForm />
      </SheetContent>
    </Sheet>
  );
}
