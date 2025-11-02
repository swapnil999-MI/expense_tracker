import { Transaction, ITransaction } from "../../models/transaction.model";
import {TransactionFilters } from "../../interfaces/v1/transaction.interfaces";
export const transactionService = {
  async create(data: Partial<ITransaction>) {
    const transaction = await Transaction.create(data);
    return transaction;
  },

  async getAll(filters: TransactionFilters) {
  const query: Record<string, any> = {};

  // ✅ Filter by type
  if (filters.type) query.type = filters.type;

  // ✅ Filter by category
  if (filters.category) query.category = filters.category;

  // ✅ Filter by date range
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  // ✅ Conditional search logic
  if (filters.search) {
    const searchValue = filters.search.trim();
    const isNumericSearch = !isNaN(Number(searchValue)); // ✅ convert to number before check

    if (isNumericSearch) {
      // When searching by number → match amount exactly or partially
      query.$or = [
        { amount: Number(searchValue) },
        { description: new RegExp(searchValue, "i") },
        { category: new RegExp(searchValue, "i") },
      ];
    } else {
      // When searching text → regex only for strings
      const searchRegex = new RegExp(searchValue, "i");
      query.$or = [
        { description: searchRegex },
        { category: searchRegex },
      ];
    }
  }

  // ✅ Pagination logic (type-safe)
  const page = parseInt(String(filters.page || "1"));
  const pageSize = parseInt(String(filters.pageSize || "10"));
  const skip = (page - 1) * pageSize;

  // ✅ Fetch data and total count in parallel
  const [transactions, total] = await Promise.all([
    Transaction.find(query).sort({ date: -1 }).skip(skip).limit(pageSize),
    Transaction.countDocuments(query),
  ]);

  // ✅ Return paginated response
  return {
    success: true,
    message: "Fetched transactions successfully",
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    data: transactions,
  };
},

  async update(id: string, data: Partial<ITransaction>) {
    const updated = await Transaction.findByIdAndUpdate(id, data, { new: true });
    return updated;
  },

  async remove(id: string) {
    const deleted = await Transaction.findByIdAndDelete(id);
    return deleted;
  },
  async getDashboardStats() {
    const allTransactions = await Transaction.find();

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses: Record<string, number> = {};

    for (const t of allTransactions) {
      if (t.type === "income") totalIncome += t.amount;
      else {
        totalExpense += t.amount;
        categoryExpenses[t.category] =
          (categoryExpenses[t.category] || 0) + t.amount;
      }
    }

    const netBalance = totalIncome - totalExpense;

    const categoryExpenseArray = Object.entries(categoryExpenses).map(
      ([category, amount]) => ({
        category,
        amount: parseFloat(amount.toFixed(2)),
      })
    );

    return {
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      netBalance: parseFloat(netBalance.toFixed(2)),
      categoryExpenses: categoryExpenseArray,
    };
  },
};
