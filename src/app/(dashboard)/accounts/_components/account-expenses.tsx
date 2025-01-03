import CategoryBadge from "@/components/category-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/schemas/transaction";
import dayjs from "dayjs";

type AccountExpensesProps = {
  transactions: Transaction[];
};

const expensesInfo = [
  {
    monthYear: "January 2024",
    amount: 1000,
    expenses: [
      { name: "Rent", amount: 500 },
      { name: "Electricity", amount: 100 },
      { name: "Water", amount: 50 },
    ],
  },
];

type TransactionInfo = {
  monthYear: string;
  amount: number;
  expenses: Transaction[];
};

export default function AccountExpenses({
  transactions,
}: AccountExpensesProps) {
  const transactionsInfo: Array<TransactionInfo> = [];

  transactions?.forEach((transaction) => {
    const monthYear = dayjs(transaction.created_at).format("MMMM YYYY");
    const date = dayjs(transaction.created_at).format("ddd, MMM D");

    if (!transactionsInfo?.length) {
      transactionsInfo.push({
        monthYear,
        amount: transaction.value,
        expenses: [transaction],
      });
    } else {
      const alreadyHaveMonthYear = transactionsInfo.find(
        (info) => info.monthYear === monthYear,
      );

      if (!alreadyHaveMonthYear) {
        transactionsInfo.push({
          monthYear,
          amount: transaction.value,
          expenses: [transaction],
        });
      } else {
        alreadyHaveMonthYear.expenses.push(transaction);
        alreadyHaveMonthYear.amount += transaction.value;
      }
    }
  });

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {transactionsInfo.map((transaction) => {
        return (
          <div className="flex flex-col gap-3" key={transaction.monthYear}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{transaction.monthYear}</h2>
              <p className="text-base">{formatCurrency(transaction.amount)}</p>
            </div>
            <div className="flex flex-col gap-1">
              {transaction.expenses.map((expense) => {
                return (
                  <div key={expense.id} className="flex flex-col gap-1">
                    <div className="grid grid-cols-[32px_1fr_1fr_1fr_auto] items-center rounded-sm p-2 hover:bg-muted">
                      <Checkbox className="size-4 rounded-[4px]" />
                      <p className="text-base">{expense.name}</p>
                      <p>{dayjs(expense.created_at).format("DD MMM")}</p>
                      <CategoryBadge category={expense.category} />
                      <p className="text-base">
                        {formatCurrency(expense.value)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
