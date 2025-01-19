import CategoryBadge from "@/components/category-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatCurrency } from "@/lib/utils";
import { Transaction } from "@/schemas/transaction";
import dayjs from "dayjs";

type TransactionInfo = {
  monthYear: string;
  amount: number;
  expenses: Transaction[];
};

type AccountExpensesProps = {
  transactions: Transaction[];
  initialBalance?: number;
};
export default function AccountExpenses({
  transactions,
  initialBalance,
}: AccountExpensesProps) {
  const transactionsInfo: Array<TransactionInfo> = [];

  transactions?.forEach((transaction) => {
    const monthYear = dayjs(transaction.created_at).format("MMMM YYYY");

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

  transactionsInfo.sort((a, b) => {
    return dayjs(b.monthYear).diff(dayjs(a.monthYear));
  });

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {transactionsInfo.map((transaction) => {
        const sortedTransactions = transaction.expenses.sort((a, b) => {
          return dayjs(b.created_at).diff(dayjs(a.created_at));
        });

        return (
          <div className="flex flex-col gap-3" key={transaction.monthYear}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{transaction.monthYear}</h2>
            </div>
            <div className="flex flex-col gap-1">
              {sortedTransactions.map((expense) => {
                return (
                  <div key={expense.id} className="flex flex-col gap-1">
                    <div className="grid grid-cols-[1fr_1fr_100px_1fr_auto] items-center rounded-sm p-2 hover:bg-muted">
                      <p className="text-base">{expense.name}</p>
                      <p>{dayjs(expense.created_at).format("DD MMM")}</p>
                      <CategoryBadge category={expense.category} />
                      <p
                        className={cn(
                          expense.transactionType === "expense"
                            ? "text-base"
                            : "text-green-500",
                          "text-right text-base",
                        )}
                      >
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
      {initialBalance && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Initial Balance</h2>
          <p className="text-base">
            {formatCurrency(initialBalance, {
              currency: "EUR",
              locale: "de-DE",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
