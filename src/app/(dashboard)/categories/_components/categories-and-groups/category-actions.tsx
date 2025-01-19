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
import { Category, CategoryGroupWithCategories } from "@/schemas/category";
import { EllipsisVertical, PackageX, Pencil, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import {
  addCategoryToGroup,
  deleteCategory,
  removeCategoryFromGroup,
} from "../../actions";
import { useToast } from "@/hooks/use-toast";
import EditCategory from "../categories/edit-category";
import { useState } from "react";

type CategoryActionsProps = {
  groups: CategoryGroupWithCategories[];
  category: Category;
  hasGroup: boolean;
};

export default function CategoryActions({
  groups,
  category,
  hasGroup,
}: CategoryActionsProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(addCategoryToGroup, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category added to group successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.error.serverError,
        variant: "destructive",
      });
    },
  });

  const { execute: removeFromGroup } = useAction(removeCategoryFromGroup, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category removed from group successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.error.serverError,
        variant: "destructive",
      });
    },
  });

  const { execute: deleteCategoryAction } = useAction(deleteCategory, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.error.serverError,
        variant: "destructive",
      });
    },
  });

  return (
    <>
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
            <DropdownMenuItem onSelect={() => setOpen(true)}>
              <Pencil />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuGroup>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <Trash2 className="text-red-500" />
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              {groups.length > 0 && (
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
                                categoryId: category.id,
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
              )}
              {hasGroup && (
                <DropdownMenuItem
                  onSelect={() => removeFromGroup({ categoryId: category.id })}
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
              onClick={() => deleteCategoryAction({ categoryId: category.id })}
            >
              {isExecuting ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditCategory open={open} setOpen={setOpen} category={category} />
    </>
  );
}
