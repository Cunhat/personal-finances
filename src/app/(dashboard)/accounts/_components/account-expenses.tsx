import Table from "@/components/table/table";
import { Transaction } from "@/schemas/transaction";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type AccountExpensesProps = {
  transactions: Transaction[];
};

const expensesInfo = [
  {
    monthYear: "January 2024",
    amount: 1000,
    expenses: {
      "Mon, January 1": [
        { name: "Rent", amount: 500 },
        { name: "Electricity", amount: 100 },
        { name: "Water", amount: 50 },
      ],
    },
  },
];

type TransactionInfo = {
  monthYear: string;
  amount: number;
  expenses: {
    [key: string]: Array<Transaction>;
  };
};

export default function AccountExpenses({
  transactions,
}: AccountExpensesProps) {
  const transactionsInfo: Array<TransactionInfo> = [];

  transactions.forEach((transaction) => {
    const monthYear = dayjs(transaction.created_at).format("MMMM YYYY");
    const date = dayjs(transaction.created_at).format("ddd, MMM D");

    if (!transactionsInfo?.length) {
      transactionsInfo.push({
        monthYear,
        amount: 0,
        expenses: {
          [date]: [transaction],
        },
      });
    } else {
      const alreadyHaveMonthYear = transactionsInfo.find(
        (info) => info.monthYear === monthYear,
      );

      if (!alreadyHaveMonthYear) {
        transactionsInfo.push({
          monthYear,
          amount: 0,
          expenses: {
            [date]: [transaction],
          },
        });
      } else {
        const alreadyHaveDate = alreadyHaveMonthYear.expenses[date];

        if (!alreadyHaveDate) {
          alreadyHaveMonthYear.expenses[date] = [transaction];
        } else {
          alreadyHaveMonthYear.expenses[date] = [
            ...alreadyHaveDate,
            transaction,
          ];
        }
      }
    }
  });

  return (
    <div className="flex h-full flex-col gap-6">
      {transactionsInfo.map((transaction) => {
        return (
          <div className="flex flex-col gap-3" key={transaction.monthYear}>
            <div className="flex items-center justify-between pl-3">
              <h2 className="text-lg font-semibold">{transaction.monthYear}</h2>
              <p className="text-base">{formatCurrency(transaction.amount)}</p>
            </div>
            <div className="flex flex-col gap-2">
              {Object.entries(transaction.expenses).map(
                ([date, transactions]) => {
                  return (
                    <div className="flex flex-col gap-2" key={date}>
                      <h2 className="pl-3 text-base text-muted-foreground">
                        {date}
                      </h2>
                      <div className="flex flex-col gap-1">
                        {transactions.map((transaction) => {
                          return (
                            <div className="grid grid-cols-[20px_1fr_1fr_1fr] items-center gap-2">
                              <Checkbox />
                              <p>{transaction.name}</p>
                              <p>{transaction.categoryId}</p>
                              <p>{formatCurrency(transaction.value)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
