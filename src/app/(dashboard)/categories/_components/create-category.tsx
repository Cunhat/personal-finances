"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import CreateCategoryForm from "./create-category-form";
import { Button } from "@/components/ui/button";

export default function CreateCategory() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <span>New from scratch...</span>
        </DropdownMenuItem>
      </SheetTrigger>
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
