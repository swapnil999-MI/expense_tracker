// src/components/TransactionForm.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { createTransaction, fetchTransactions } from "@/redux/slices/transactionsSlice";
// import toast from 'react-hot-toast'; // REMOVE THIS LINE

interface TransactionFormProps {
  onSuccess?: () => void;
  initialType?: "income" | "expense";
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, initialType = "expense" }) => {
  const dispatch = useDispatch<AppDispatch>();
  console.log("rerender")
  const [form, setForm] = useState({
    type: initialType,
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null); // For client-side validation only

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null); // Clear previous local errors

    // Client-side validation
    const amountNum = Number(form.amount);
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
      setLocalError("Please enter a valid positive amount.");
      // toast.error("Please enter a valid positive amount."); // REMOVED: If client-side toasts are handled here
      return;
    }
    if (!form.category.trim()) {
      setLocalError("Please enter a category.");
      // toast.error("Please enter a category."); // REMOVED
      return;
    }
    if (!form.date) {
      setLocalError("Please select a date.");
      // toast.error("Please select a date."); // REMOVED
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        createTransaction({
          type: form.type as "income" | "expense",
          amount: amountNum,
          description: form.description.trim(),
          category: form.category.trim(),
          date: form.date,
        }) as any
      ).unwrap(); // Use unwrap to catch async errors from thunk

      // Reset form after successful submission
      setForm({
        type: initialType,
        amount: "",
        description: "",
        category: "",
        date: new Date().toISOString().slice(0, 10),
      });
      // toast.success("Transaction added successfully!"); // REMOVED: Handled in slice
      if (onSuccess) {
        onSuccess();
      }
      // ONLY dispatch fetchTransactions ON SUCCESS
      dispatch(fetchTransactions() as any);

    }  catch (err: any) {
    console.error("Failed to create transaction (caught in component):", err);

    // Safely extract backend error info
    const backendError = err?.errors
      ? err.errors.join(", ")
      : err?.message || "An unknown error occurred.";

    console.log("Backend Error:", backendError);
    setLocalError(backendError);
  } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Add New Transaction</h2>

      {localError && !loading && ( // Optionally display client-side validation errors inline
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-md" role="alert">
          <p className="font-bold">Error!</p>
          <p>{localError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... rest of your form inputs remain the same ... */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="e.g., 150.75"
            value={form.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            className="mt-1 block w-full px-3 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            placeholder="e.g., Groceries, Salary, Rent"
            value={form.category}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="e.g., Weekly grocery shopping"
            value={form.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Add Transaction"
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;