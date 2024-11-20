import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category, CategoryGroupWithCategories } from "@/schemas/category";
import { EllipsisVertical, Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { addCategoryToGroup } from "../../actions";

type SetGroupProps = {
  groups: CategoryGroupWithCategories[];
  categoryId: number;
};

export default function SetGroup({ groups, categoryId }: SetGroupProps) {
  const { execute, isExecuting } = useAction(addCategoryToGroup, {
    // onSuccess: () => {},
    // onError: (error) => {},
  });

  return (
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
              <span>Set Group</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="max-h-[500px] overflow-y-auto">
                {groups.map((group) => {
                  return (
                    <DropdownMenuItem
                      key={group.id}
                      onSelect={() =>
                        execute({
                          categoryId: categoryId,
                          groupId: group.id,
                        })
                      }
                    >
                      <span>{group.name}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
