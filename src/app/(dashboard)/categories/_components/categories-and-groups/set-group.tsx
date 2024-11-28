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
import { EllipsisVertical, Plus, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { addCategoryToGroup, removeCategoryFromGroup } from "../../actions";

type SetGroupProps = {
  groups: CategoryGroupWithCategories[];
  categoryId: number;
  hasGroup: boolean;
};

export default function SetGroup({
  groups,
  categoryId,
  hasGroup,
}: SetGroupProps) {
  const { execute, isExecuting } = useAction(addCategoryToGroup, {
    // onSuccess: () => {},
    // onError: (error) => {},
  });

  const { execute: removeFromGroup } = useAction(removeCategoryFromGroup, {
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
          {hasGroup && (
            <DropdownMenuItem
              onSelect={() => removeFromGroup({ categoryId: categoryId })}
            >
              <Trash2 />
              <span>Remove from Group</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
