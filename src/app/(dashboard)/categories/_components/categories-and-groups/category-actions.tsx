import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { CategoryGroupWithCategories } from "@/schemas/category";
import { EllipsisVertical, PackageX, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import {
  addCategoryToGroup,
  deleteCategory,
  removeCategoryFromGroup,
} from "../../actions";

type CategoryActionsProps = {
  groups: CategoryGroupWithCategories[];
  categoryId: number;
  hasGroup: boolean;
};

export default function CategoryActions({
  groups,
  categoryId,
  hasGroup,
}: CategoryActionsProps) {
  const { execute, isExecuting } = useAction(addCategoryToGroup, {
    // onSuccess: () => {},
    // onError: (error) => {},
  });

  const { execute: removeFromGroup } = useAction(removeCategoryFromGroup, {
    // onSuccess: () => {},
    // onError: (error) => {},
  });

  const { execute: deleteCategoryAction } = useAction(deleteCategory, {
    // onSuccess: () => {},
    // onError: (error) => {},
  });

  return (
    <AlertDialog>
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
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <Trash2 className="text-red-500" />
                <span className="text-red-500">Delete</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
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
                <PackageX />
                <span>Remove from Group</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            category from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isExecuting}
            onClick={() => deleteCategoryAction({ categoryId: categoryId })}
          >
            {isExecuting ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
