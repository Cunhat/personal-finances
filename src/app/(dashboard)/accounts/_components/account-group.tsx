"use client";
import BalanceEvolutionTag from "@/components/balance-evolution-tag";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency, generateBalanceChange } from "@/lib/utils";
import { Account } from "@/schemas/account";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

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
  const [expanded, setExpanded] = useState(true);
  const [_, setAccountId] = useQueryState("accountId");

  useEffect(() => {
    const variation = generateBalanceChange();
    setBalanceVariation(variation);
  }, []);

  const groupTotalBalance = formatCurrency(
    accounts.reduce((acc, account) => acc + account.balance, 0),
    {
      currency: "EUR",
      locale: "de-DE",
    },
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
              {groupTotalBalance}
            </motion.p>
          )}
        </div>
        {expanded && (
          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-2">
              {accounts.map((account, index) => (
                <motion.div
                  onClick={async () => {
                    await setAccountId(account.id.toString());
                  }}
                  key={account.id}
                  className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-4 rounded-md p-2 hover:bg-muted/75"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div>{account.name}</div>

                  <p className="text-sm">
                    {formatCurrency(account.balance, {
                      currency: "EUR",
                      locale: "de-DE",
                    })}
                  </p>
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
                {groupTotalBalance}
              </motion.p>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
