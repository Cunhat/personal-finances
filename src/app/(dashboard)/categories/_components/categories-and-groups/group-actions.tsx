import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { deleteGroup } from "../../actions";

type GroupActionsProps = {
  groupId: number;
};

export default function GroupActions({ groupId }: GroupActionsProps) {
  const { execute, isExecuting } = useAction(deleteGroup, {
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
      <DropdownMenuContent>
        <DropdownMenuLabel>Group Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => execute({ groupId })}>
          <Trash2 className="text-red-500" />
          <span className="text-red-500">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
