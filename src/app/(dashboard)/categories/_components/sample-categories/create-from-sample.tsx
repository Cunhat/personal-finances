"use client";

import { useAction } from "next-safe-action/hooks";
import React from "react";
import { createCategory } from "../../actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type CreateFromSampleProps = {
  category: {
    id: number;
    icon: string;
    name: string;
    color: string;
  };
};

export default function CreateFromSample({ category }: CreateFromSampleProps) {
  const { toast } = useToast();

  const { execute, isExecuting } = useAction(createCategory, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category created successfully",
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
