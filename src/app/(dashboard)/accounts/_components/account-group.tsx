"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, generateBalanceChange } from "@/lib/utils";
import { Account } from "@/schemas/account";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cva } from "class-variance-authority";

type AccountGroupProps = {
  groupName: string;
  accounts: Array<Account>;
};

export default function AccountGroup({
  groupName,
  accounts,
}: AccountGroupProps) {
  const [balanceVariation, setBalanceVariation] = useState({
    percentage: 0,
    isIncrease: true,
    formattedPercentage: "0",
    multiplier: 1,
  });

  useEffect(() => {
    const variation = generateBalanceChange();
    setBalanceVariation(variation);
  }, []);

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
            <div className="flex flex-col gap-2">
              {accounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div>{account.name}</div>
                  <BalanceEvolutionTag
                    percentage={balanceVariation.percentage}
                    isIncrease={balanceVariation.isIncrease}
                  />
                  <p className="text-sm">{account.balance} €</p>
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

const BalanceEvolutionTagStyles = cva(
  "rounded-md px-2 py-px flex items-center gap-1",
  {
    variants: {
      isIncrease: {
        true: "bg-green-500/40 border border-green-500",
        false: "bg-red-500/40 border border-red-500",
      },
    },
  },
);

const BalanceEvolutionTag = ({
  percentage,
  isIncrease,
}: {
  percentage: number;
  isIncrease: boolean;
}) => {
  return (
    <div className={BalanceEvolutionTagStyles({ isIncrease })}>
      {isIncrease ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}
      <p className="text-sm">{percentage}%</p>
    </div>
  );
};
