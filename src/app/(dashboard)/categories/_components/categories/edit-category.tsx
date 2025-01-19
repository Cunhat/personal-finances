import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import EditCategoryForm from "./edit-category-form";
import { Category } from "@/schemas/category";

type EditCategoryProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: Category;
};

export default function EditCategory({
  open,
  setOpen,
  category,
}: EditCategoryProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
          <SheetDescription>
            Edit your category to organize and track your transactions.
            Categories help you understand your spending patterns.
          </SheetDescription>
        </SheetHeader>
        <EditCategoryForm setOpen={setOpen} category={category} />
      </SheetContent>
    </Sheet>
  );
}
