"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Account } from "@/schemas/account";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

type AccountGroupProps = {
  groupName: string;
  accounts: Array<Account>;
};

export default function AccountGroup({
  groupName,
  accounts,
}: AccountGroupProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-1 rounded-md p-2 hover:bg-muted/75"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronDownIcon
          className={cn("h-4 w-4 transition-all", expanded && "rotate-180")}
        />
        <h1>{groupName}</h1>
      </div>
      {expanded && (
        <div className="flex flex-col gap-1 p-4">
          {accounts.map((account) => (
            <div key={account.id}>{account.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
