  import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
  import { api } from "@/api/axiosClient";

  export interface TransactionFilters {
    search: string;
    type: "" | "income" | "expense";
    category: string;
    startDate: string;
    endDate: string;
  }

  interface Transaction {
    _id: string;
    category: string;
    description?: string;
    date: string;
    type: "income" | "expense";
    amount: number;
  }

  interface DashboardData {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    expensePieData: { name: string; value: number }[];
  }

  interface TransactionsState {
    list: Transaction[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    filters: TransactionFilters;
    dashboard: DashboardData | null;
    dashboardLoading: boolean;
  }

  // ✅ Fetch all transactions
  export const fetchTransactions = createAsyncThunk(
    "transactions/fetch",
    async (
      params: {
        page?: number;
        pageSize?: number;
        search?: string;
        type?: "" | "income" | "expense";
        category?: string;
        startDate?: string;
        endDate?: string;
      } = {},
      { rejectWithValue }
    ) => {
      try {
        const effectiveParams = { pageSize: 10, ...params };
        const response = await api.get("main", "transactions", "", { params: effectiveParams });
        return response.data.data;
      } catch (error: any) {
        const errData = error.response?.data;
        return rejectWithValue(errData?.message || "Failed to fetch transactions");
      }
    }
  );

  // ✅ Fetch Dashboard Stats (Total Income, Expense, Balance, Pie Data)
  export const fetchDashboardData = createAsyncThunk(
    "transactions/fetchDashboardData",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get("main", "dashboard_data");
        console.log(response.data.data);
        return response.data.data; // Expecting { totalIncome, totalExpense, netBalance, expensePieData }
      } catch (error: any) {
        const errData = error.response?.data;
        return rejectWithValue(errData?.message || "Failed to fetch dashboard data");
      }
    }
  );

  // ✅ Create transaction
  export const createTransaction = createAsyncThunk(
    "transactions/create",
    async (data: Omit<Transaction, "_id">, { rejectWithValue }) => {
      try {
        const response = await api.post("main", "transactions", data);
        return response.data.data;
      } catch (error: any) {
        const errData = error.response?.data;
        return rejectWithValue(errData);
      }
    }
  );

  // ✅ Update transaction
  export const updateTransaction = createAsyncThunk(
    "transactions/update",
    async ({ id, data }: { id: string; data: Partial<Transaction> }, { rejectWithValue }) => {
      try {
        const response = await api.put("main", "transactions", `${id}/`, data);
        return response.data.data;
      } catch (error: any) {
        const errData = error.response?.data;
        return rejectWithValue(errData);
      }
    }
  );

  // ✅ Delete transaction
  export const deleteTransaction = createAsyncThunk(
    "transactions/delete",
    async (id: string, { rejectWithValue }) => {
      try {
        await api.delete("main", "transactions", `${id}/`);
        return id;
      } catch (error: any) {
        const errData = error.response?.data;
        return rejectWithValue(errData);
      }
    }
  );

  const transactionSlice = createSlice({
    name: "transactions",
    initialState: {
      list: [],
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
      filters: {
        search: "",
        type: "",
        category: "",
        startDate: "",
        endDate: "",
      },
      dashboard: null,
      dashboardLoading: false,
    } as TransactionsState,
    reducers: {
      setPage: (state, action: PayloadAction<number>) => {
        state.page = action.payload;
      },
      setFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
        state.filters = { ...state.filters, ...action.payload };
        state.page = 1;
      },
    },
    extraReducers: (builder) => {
      builder
        // 🔹 FETCH TRANSACTIONS
        .addCase(fetchTransactions.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTransactions.fulfilled, (state, action) => {
          state.loading = false;
          state.list = action.payload.data || [];
          state.totalPages = action.payload.totalPages || 1;
          // state.page = action.payload.currentPage || 1;
        })
        .addCase(fetchTransactions.rejected, (state, action) => {
          state.loading = false;
          state.error =
            typeof action.payload === "object"
              ? (action.payload as any)?.message || "Failed to fetch transactions"
              : (action.payload as string);
        })

        // 🔹 DASHBOARD DATA
        .addCase(fetchDashboardData.pending, (state) => {
          state.dashboardLoading = true;
        })
        .addCase(fetchDashboardData.fulfilled, (state, action) => {
          state.dashboardLoading = false;
          state.dashboard = action.payload;
        })
        .addCase(fetchDashboardData.rejected, (state, action) => {
          state.dashboardLoading = false;
          state.error =
            typeof action.payload === "object"
              ? (action.payload as any)?.message || "Failed to fetch dashboard data"
              : (action.payload as string);
        })

        // 🔹 CREATE
        .addCase(createTransaction.rejected, (state, action) => {
          const err = action.payload as any;
          state.error = err?.errors?.join(", ") || err?.message || "Failed to create transaction";
        })

        // 🔹 UPDATE
        .addCase(updateTransaction.fulfilled, (state, action) => {
          const index = state.list.findIndex((t) => t._id === action.payload._id);
          if (index !== -1) state.list[index] = action.payload;
        })
        .addCase(updateTransaction.rejected, (state, action) => {
          const err = action.payload as any;
          state.error = err?.errors?.join(", ") || err?.message || "Failed to update transaction";
        })

        // 🔹 DELETE
        .addCase(deleteTransaction.rejected, (state, action) => {
          const err = action.payload as any;
          state.error = err?.errors?.join(", ") || err?.message || "Failed to delete transaction";
        });
    },
  });

  export const { setPage, setFilters } = transactionSlice.actions;
  export default transactionSlice.reducer;
