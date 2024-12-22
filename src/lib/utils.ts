import { clsx, type ClassValue } from "clsx";
import { ValidationErrors } from "next-safe-action";
import { UseFormReturn, Path } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { TransactionType } from "@/server/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getValidationErrors<T extends Record<string, any>>(
  validationErrors: ValidationErrors<any>,
  form: UseFormReturn<T>,
) {
  Object.entries(validationErrors).forEach(([key, value]) => {
    form.setError(key as Path<T>, {
      message: Array.isArray(value)
        ? value[0]
        : (value as { _errors?: string[] })?._errors?.[0],
    });
  });
}

/**
 * Generates a random percentage change for balance between -100% and +100%
 * @param options Configuration for percentage generation
 * @returns An object containing the percentage and whether it's an increase
 */
export function generateBalanceChange(options?: {
  minPercentage?: number; // Minimum percentage change (default: -100)
  maxPercentage?: number; // Maximum percentage change (default: 100)
  decimals?: number; // Number of decimal places (default: 2)
}) {
  const {
    minPercentage = -100,
    maxPercentage = 100,
    decimals = 2,
  } = options ?? {};

  // Generate random percentage between min and max
  const percentage = Number(
    (Math.random() * (maxPercentage - minPercentage) + minPercentage).toFixed(
      decimals,
    ),
  );

  // Determine if it's an increase or decrease
  const isIncrease = percentage > 0;

  return {
    percentage: Math.abs(percentage), // Always positive number
    isIncrease,
    formattedPercentage: `${isIncrease ? "+" : "-"}${Math.abs(percentage)}%`,
    multiplier: 1 + percentage / 100, // Useful for calculations
  };
}

export function formatCurrency(
  amount: number,
  options?: {
    locale?: string;
    currency?: string;
  },
) {
  const { locale = "de-DE", currency = "EUR" } = options ?? {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function hexToRgb(hex: string, opacity: number): string | null {
  if (!hex) return null;
  // Remove the hash if present
  hex = hex.replace(/^#/, "");

  // Parse 3-digit hex
  if (hex.length === 3 && hex[0] && hex[1] && hex[2]) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse the hex values
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex,
  ) as string[];

  if (!result) return null;

  return `rgba(${parseInt(result[1]!, 16)}, ${parseInt(result[2]!, 16)}, ${parseInt(result[3]!, 16)}, ${opacity})`;
}

// type GenerateTransactionsOptions = {
//   accountIds: number[];
//   categoryIds: number[];
//   expenseCategoryIds: number[];
//   incomeCategoryIds: number[];
//   userId: string;
//   monthsBack?: number;
//   minTransactionsPerMonth?: number;
//   maxTransactionsPerMonth?: number;
//   minAmount?: number;
//   maxAmount?: number;
// };

// export function generateRandomTransactions({
//   accountIds,
//   categoryIds,
//   expenseCategoryIds,
//   incomeCategoryIds,
//   userId,
//   monthsBack = 6,
//   minTransactionsPerMonth = 15,
//   maxTransactionsPerMonth = 30,
//   minAmount = 100,
//   maxAmount = 5000,
// }: GenerateTransactionsOptions) {
//   const transactions = [];
//   const now = dayjs();

//   // Track balance per account
//   const accountBalances: Record<number, number> = {};
//   accountIds.forEach((id) => {
//     accountBalances[id] = 0;
//   });

//   // First generate some income transactions to build up initial balances
//   accountIds.forEach((accountId) => {
//     transactions.push({
//       name: "Initial Balance",
//       value: 10000, // Start with substantial balance
//       created_at: now
//         .subtract(monthsBack, "month")
//         .startOf("month")
//         .toISOString(),
//       transactionType: "income",
//       categoryId: categoryIds[0]!,
//       accountId,
//       userId,
//     });
//     accountBalances[accountId] = 10000;
//   });

//   // Transaction descriptions for more realistic data
//   const transactionDescriptions = {
//     expense: [
//       "Grocery Shopping",
//       "Rent Payment",
//       "Utilities",
//       "Internet Bill",
//       "Phone Bill",
//       "Restaurant",
//       "Coffee Shop",
//       "Gas Station",
//       "Public Transport",
//       "Gym Membership",
//       "Movie Tickets",
//       "Online Shopping",
//       "Healthcare",
//       "Insurance Payment",
//       "Home Maintenance",
//     ],
//     income: [
//       "Salary",
//       "Freelance Payment",
//       "Investment Return",
//       "Dividend",
//       "Client Payment",
//       "Consulting Fee",
//       "Bonus",
//       "Side Project Revenue",
//       "Rental Income",
//       "Interest Income",
//     ],
//   };

//   // Generate transactions for each month
//   for (let i = 0; i < monthsBack; i++) {
//     const monthStart = now.subtract(i, "month").startOf("month");
//     const monthEnd = monthStart.endOf("month");

//     // Random number of transactions for this month
//     const transactionsCount =
//       Math.floor(
//         Math.random() * (maxTransactionsPerMonth - minTransactionsPerMonth + 1),
//       ) + minTransactionsPerMonth;

//     // Generate transactions for this month
//     for (let j = 0; j < transactionsCount; j++) {
//       // Random date within the month
//       const date = dayjs(
//         monthStart.valueOf() +
//           Math.random() * (monthEnd.valueOf() - monthStart.valueOf()),
//       );

//       const accountId =
//         accountIds[Math.floor(Math.random() * accountIds.length)]!;
//       const currentBalance = accountBalances[accountId]!;

//       // Adjust transaction type based on balance
//       const transactionType: TransactionType =
//         currentBalance < 1000 || Math.random() < 0.4 ? "income" : "expense";

//       // Adjust amount based on transaction type and current balance
//       const amount =
//         transactionType === "expense"
//           ? Math.min(
//               Number(
//                 (Math.random() * (maxAmount - minAmount) + minAmount).toFixed(
//                   2,
//                 ),
//               ),
//               currentBalance * 0.8, // Never spend more than 80% of current balance
//             )
//           : Number(
//               (Math.random() * (maxAmount - minAmount) + minAmount).toFixed(2),
//             );

//       // Update running balance
//       accountBalances[accountId] +=
//         transactionType === "income" ? amount : -amount;

//       // Random account and category
//       const categoryId =
//         transactionType === "expense"
//           ? expenseCategoryIds[
//               Math.floor(Math.random() * expenseCategoryIds.length)
//             ]!
//           : incomeCategoryIds[
//               Math.floor(Math.random() * incomeCategoryIds.length)
//             ]!;

//       // Random description based on type
//       const descriptions = transactionDescriptions[transactionType];
//       const name =
//         descriptions[Math.floor(Math.random() * descriptions.length)];

//       // Ensure non-null values when pushing transactions
//       transactions.push({
//         name: name as string,
//         value: amount,
//         created_at: date.toISOString(),
//         transactionType,
//         categoryId: categoryId!,
//         accountId,
//         userId,
//       });
//     }
//   }

//   // Sort by date descending
//   return transactions.sort(
//     (a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf(),
//   );
// }
