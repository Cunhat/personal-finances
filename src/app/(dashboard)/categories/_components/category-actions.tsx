"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";

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
import CreateCategory from "./categories/create-category";
import CreateGroup from "./create-group";

type CategoryActionsProps = {
  sampleCategories: React.ReactNode;
};

export default function CategoryActions({
  sampleCategories,
}: CategoryActionsProps) {
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="size-8">
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
                  <DropdownMenuItem
                    onSelect={(e) => {
                      setOpenCreateCategory(true);
                    }}
                  >
                    <span>New from scratch...</span>
                  </DropdownMenuItem>
                  {sampleCategories}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onSelect={() => setOpenCreateGroup(true)}>
              <Plus />
              Add Group
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateCategory
        open={openCreateCategory}
        setOpen={setOpenCreateCategory}
      />
      <CreateGroup open={openCreateGroup} setOpen={setOpenCreateGroup} />
    </>
  );
}
