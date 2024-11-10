"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Account } from "@/schemas/account";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AccountGroupProps = {
  groupName: string;
  accounts: Array<Account>;
};

export default function AccountGroup({
  groupName,
  accounts,
}: AccountGroupProps) {
  const [expanded, setExpanded] = useState(true);

  const groupTotalBalance = accounts.reduce(
    (acc, account) => acc + account.balance,
    0,
  );

  return (
    <AnimatePresence>
      <div>
        <div
          className="flex cursor-pointer items-center gap-1 rounded-md p-2 hover:bg-muted/75"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-1">
            <ChevronDownIcon
              className={cn("h-4 w-4 transition-all", expanded && "rotate-180")}
            />
            <h1>{groupName}</h1>
          </div>
          {!expanded && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="ml-auto text-sm"
            >
              {groupTotalBalance} €
            </motion.p>
          )}
        </div>
        {expanded && (
          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-1">
              {accounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div>{account.name}</div>
                  <p className="ml-auto text-sm">{account.balance} €</p>
                </motion.div>
              ))}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="ml-auto text-sm"
              >
                {groupTotalBalance} €
              </motion.p>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
