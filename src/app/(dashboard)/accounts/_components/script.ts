"use server";

import { transaction } from "@/server/db/schema";

import { db } from "@/server/db";

export const generateTransactions = async () => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  const transactions = [];

  // Generate 100 random transactions
  for (let i = 0; i < 100; i++) {
    // Random date between startDate and now
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (new Date().getTime() - startDate.getTime()),
    );

    transactions.push({
      name: "Transaction " + i,
      value: Number((Math.random() * 490 + 10).toFixed(2)),
      created_at: randomDate.toISOString(),
      transactionType: Math.random() < 0.7 ? "expense" : ("income" as const),
      categoryId: Math.floor(Math.random() * (24 - 12 + 1)) + 12,
      userId: "user_2oImRUt14aZPtYmMo2ZiJLFH917",
      accountId: Math.random() < 0.33 ? 6 : Math.random() < 0.66 ? 7 : 8,
    });
  }

  await db.insert(transaction).values(transactions);
};
