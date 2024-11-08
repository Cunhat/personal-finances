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
    color: string;
  };
};

export default function CreateFromSample({ category }: CreateFromSampleProps) {
  const { execute, isExecuting } = useAction(createCategory, {
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <DropdownMenuItem
      key={category.id}
      disabled={isExecuting}
      onSelect={() =>
        execute({
          name: category.name,
          icon: category.icon,
          color: category.color,
        })
      }
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
    </DropdownMenuItem>
  );
}
