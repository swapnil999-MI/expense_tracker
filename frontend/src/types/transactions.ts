export type Transaction = {
  _id: string;
  type: "income" | "expense";
  amount: number;
  description?: string;
  category: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TransactionCreate = Omit<Transaction, "_id" | "createdAt" | "updatedAt">;
