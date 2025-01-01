import React from "react";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Category } from "@/schemas/category";
import { updateUnprocessedTransactionCategory } from "./actions";
import { useAction } from "next-safe-action/hooks";

type UpdateCategoryProps = {
  categories: Category[];
  transactionId: string;
  value: string;
};

export default function UpdateCategory({
  categories,
  transactionId,
  value,
}: UpdateCategoryProps) {
  const { execute } = useAction(updateUnprocessedTransactionCategory);

  return (
    <Select
      onValueChange={(value) => execute({ categoryId: value, transactionId })}
      defaultValue={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()}>
            <div className="flex items-center gap-2">
              <span>{category.icon}</span>
              <span className="text-xs text-muted-foreground">
                {category.name}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
