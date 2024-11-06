"use client";

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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type CreateCategoryProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CreateCategory({ open, setOpen }: CreateCategoryProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Create Category</SheetTitle>
          <SheetDescription>
            Add a new category to organize and track your transactions.
            Categories help you understand your spending patterns.
          </SheetDescription>
        </SheetHeader>
        <CreateCategoryForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
