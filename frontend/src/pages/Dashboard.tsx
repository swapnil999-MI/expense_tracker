import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchDashboardData } from "@/redux/slices/transactionsSlice";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";

const COLORS = [
  "#4CAF50", "#F44336", "#FFC107", "#2196F3",
  "#9C27B0", "#00BCD4", "#FF5722", "#607D8B"
];

const Dashboard: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const { dashboard, dashboardLoading } = useSelector(
    (state: RootState) => ({
      dashboard: state.transactions.dashboard,
      dashboardLoading: state.transactions.dashboardLoading,
    }),
    shallowEqual
  );

  // ✅ Fetch dashboard summary on mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // ✅ Refresh summary after adding a transaction
  const handleTransactionAdded = useCallback(() => {
    dispatch(fetchDashboardData());
    setShowTransactionForm(false);
  }, [dispatch]);

  // ✅ Loading state
  if (dashboardLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-semibold text-gray-700">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 🔹 Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-lg text-gray-600 mb-2">Total Income</h2>
            <p className="text-4xl font-extrabold text-green-600">
              ₹{dashboard?.totalIncome?.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-lg text-gray-600 mb-2">Total Expense</h2>
            <p className="text-4xl font-extrabold text-red-600">
              ₹{dashboard?.totalExpense?.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-lg text-gray-600 mb-2">Net Balance</h2>
            <p className="text-4xl font-extrabold text-blue-600">
              ₹{(dashboard?.netBalance || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* 🔹 Add Transaction Button */}
        <div className="flex flex-col items-center mt-8">
          <button
            onClick={() => setShowTransactionForm((prev) => !prev)}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition mb-4"
          >
            {showTransactionForm ? "✖ Hide Transaction Form" : "➕ Add New Transaction"}
          </button>

          {showTransactionForm && (
            <div className="w-full max-w-lg transition-all duration-300">
              <TransactionForm onSuccess={handleTransactionAdded} />
            </div>
          )}
        </div>

        {/* 🔹 Expense Breakdown Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Your Spending Breakdown
          </h2>
          {dashboard?.categoryExpenses?.length ? (
            <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
              <div className="w-full lg:w-1/2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      // ✅ Transform API data for Recharts
                      data={dashboard.categoryExpenses.map((item: any) => ({
                        name: item.category,
                        value: item.amount,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {dashboard.categoryExpenses.map((_entry: any, index: number) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 py-10">
              <p className="text-xl font-medium">No expenses recorded yet.</p>
              <p className="text-md mt-2">
                Add some transactions to see your spending visualized!
              </p>
            </div>
          )}
        </div>

        {/* 🔹 Transaction List Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Recent Transactions
          </h2>
          <TransactionList />
        </div>
      </div>
    </div>
  );
});

export default Dashboard;
