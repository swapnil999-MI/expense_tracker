import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  fetchTransactions,
  setFilters,
  setPage,
  TransactionFilters,
  deleteTransaction,
} from "@/redux/slices/transactionsSlice";
import { format } from "date-fns";
import debounce from "lodash.debounce";

const TransactionList: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    list,
    loading,
    error,
    page,
    totalPages,
    filters,
  } = useSelector(
    (state: RootState) => ({
      list: state.transactions.list,
      loading: state.transactions.loading,
      error: state.transactions.error,
      page: state.transactions.page,
      totalPages: state.transactions.totalPages,
      filters: state.transactions.filters,
    }),
    shallowEqual
  );

  // Local filter states
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [localType, setLocalType] = useState(filters.type);
  const [localCategory, setLocalCategory] = useState(filters.category);
  const [localStartDate, setLocalStartDate] = useState(filters.startDate);
  const [localEndDate, setLocalEndDate] = useState(filters.endDate);

  // Sync local filters when Redux filters change
  useEffect(() => {
    setLocalSearch(filters.search);
    setLocalType(filters.type);
    setLocalCategory(filters.category);
    setLocalStartDate(filters.startDate);
    setLocalEndDate(filters.endDate);
  }, [filters]);

  // Debounce Redux filter updates
  const debouncedSetFilters = useMemo(
    () =>
      debounce((newFilters: Partial<TransactionFilters>) => {
        dispatch(setFilters(newFilters));
        dispatch(setPage(1)); // Reset to page 1 when filters change
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    return () => debouncedSetFilters.cancel();
  }, [debouncedSetFilters]);

  // ✅ Fetch transactions whenever page or filters in Redux change
  useEffect(() => {
    dispatch(
      fetchTransactions({
        page,
        pageSize: 10,
        search: filters.search,
        type: filters.type,
        category: filters.category,
        startDate: filters.startDate,
        endDate: filters.endDate,
      }) as any
    );
  }, [dispatch, page, filters]);

  // Input handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetFilters({ search: value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalType(value);
    debouncedSetFilters({ type: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalCategory(value);
    debouncedSetFilters({ category: value });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalStartDate(value);
    debouncedSetFilters({ startDate: value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalEndDate(value);
    debouncedSetFilters({ endDate: value });
  };

  // ✅ Delete handler — refetch same page after deletion
  const handleDeleteTransaction = useCallback(
    async (id: string) => {
      await dispatch(deleteTransaction(id) as any);
      dispatch(
        fetchTransactions({
          page,
          pageSize: 10,
          search: filters.search,
          type: filters.type,
          category: filters.category,
          startDate: filters.startDate,
          endDate: filters.endDate,
        }) as any
      );
    },
    [dispatch, page, filters]
  );

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center border-b pb-3">
        <input
          type="text"
          placeholder="Search (description, category)"
          value={localSearch}
          onChange={handleSearchChange}
          className="px-3 py-2 border rounded-md"
        />
        <select
          value={localType}
          onChange={handleTypeChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category (exact)"
          value={localCategory}
          onChange={handleCategoryChange}
          className="px-3 py-2 border rounded-md"
        />
        <input
          type="date"
          value={localStartDate}
          onChange={handleStartDateChange}
          className="px-3 py-2 border rounded-md"
        />
        <input
          type="date"
          value={localEndDate}
          onChange={handleEndDateChange}
          className="px-3 py-2 border rounded-md"
        />
      </div>

      {/* Transactions List */}
      {list.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No transactions found.</p>
      ) : (
        <ul className="divide-y">
          {list.map((t) => (
            <li key={t._id} className="p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{t.category}</h4>
                <p className="text-sm text-gray-500">
                  {t.description || "No description"}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(t.date), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-bold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "expense" ? "-" : "+"}₹{t.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => handleDeleteTransaction(t._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Transaction"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Pagination */}
      <div className="flex justify-center gap-3 pt-4 border-t">
        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => dispatch(setPage(page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
});

export default TransactionList;
