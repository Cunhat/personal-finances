"use client";

import { useAction } from "next-safe-action/hooks";
import React from "react";
import { createCategory } from "../../actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type CreateFromSampleProps = {
  category: {
    id: number;
    icon: string;
    name: string;
  };
};

export default function CreateFromSample({ category }: CreateFromSampleProps) {
  const { execute, isExecuting } = useAction(createCategory, {
    onSuccess: () => {},
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <DropdownMenuItem
      key={category.id}
      onSelect={() =>
        execute({
          name: category.name,
          icon: category.icon,
          color: "#FFFFFF",
        })
      }
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
    </DropdownMenuItem>
  );
}
