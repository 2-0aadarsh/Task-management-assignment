import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTasksAPI,
  createTaskAPI,
  completeTaskAPI,
  deleteTaskAPI,
} from "./taskAPI";

const formatErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

// THUNKS
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (params, thunkAPI) => {
    try {
      const res = await fetchTasksAPI(params);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(formatErrorMessage(err));
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (data, thunkAPI) => {
    try {
      const res = await createTaskAPI(data);
      const task = res?.data?.task;
      if (!task || !task._id) {
        return thunkAPI.rejectWithValue("Invalid server response while creating task");
      }
      return task;
    } catch (err) {
      return thunkAPI.rejectWithValue(formatErrorMessage(err));
    }
  }
);

export const completeTask = createAsyncThunk(
  "tasks/completeTask",
  async (id, thunkAPI) => {
    try {
      const res = await completeTaskAPI(id);
      return res.data.task;
    } catch (err) {
      return thunkAPI.rejectWithValue(formatErrorMessage(err));
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, thunkAPI) => {
    try {
      await deleteTaskAPI(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(formatErrorMessage(err));
    }
  }
);

// SLICE
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    pagination: null,
    loading: false,
    error: null,
    filter: "all",
    page: 1,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = Array.isArray(action.payload?.tasks) ? action.payload.tasks : [];
        const nextPagination = action.payload.pagination || null;
        state.pagination =
          nextPagination && nextPagination.totalPages > 0 ? nextPagination : null;
        if (!state.pagination) state.page = 1;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tasks = [];
        state.pagination = null;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        if (!action.payload || !action.payload._id) return;
        // Keep pagination metadata in sync even without a refetch.
        const limit = state.pagination?.limit || 10;
        const currentPage = state.pagination?.currentPage || state.page || 1;
        const previousTotalTasks = state.pagination?.totalTasks ?? state.tasks.length;
        const totalTasks = previousTotalTasks + 1;
        const totalPages = Math.max(1, Math.ceil(totalTasks / limit));

        // Only insert into the currently visible list when we're on page 1.
        // Otherwise, we update totals and let navigation/refetch show it.
        if (currentPage === 1) {
          state.tasks.unshift(action.payload);
          if (state.tasks.length > limit) state.tasks = state.tasks.slice(0, limit);
        }

        state.pagination = {
          totalTasks,
          totalPages,
          currentPage,
          limit,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        };
      })

      .addCase(completeTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.tasks[index] = action.payload;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (t) => t._id !== action.payload
        );

        if (state.pagination) {
          const limit = state.pagination.limit || 10;
          const totalTasks = Math.max(0, (state.pagination.totalTasks || 0) - 1);
          const totalPages = totalTasks === 0 ? 0 : Math.ceil(totalTasks / limit);

          // If we deleted the last item on the last page, jump back a page.
          if (totalPages > 0 && state.page > totalPages) {
            state.page = totalPages;
            state.pagination.currentPage = totalPages;
          }

          state.pagination = totalPages > 0
            ? {
                ...state.pagination,
                totalTasks,
                totalPages,
                currentPage: state.page,
                hasNextPage: state.page < totalPages,
                hasPrevPage: state.page > 1,
              }
            : null;
        }
      });
  },
});

export const { setFilter, setPage } = taskSlice.actions;
export default taskSlice.reducer;