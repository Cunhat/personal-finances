"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CreateGroupForm from "./create-group-form";

type CreateGroupProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CreateGroup({ open, setOpen }: CreateGroupProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Create Group</SheetTitle>
          <SheetDescription>Add a new group.</SheetDescription>
        </SheetHeader>
        <CreateGroupForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
