import {
  createSlice,
  createSelector,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@store/index";
import type { Task, TaskState, UpdateTaskPayload } from "./taskTypes";
import { createTask, fetchTask, updateTask, deleteTask } from "./taskThunks";

const taskAdapter = createEntityAdapter<Task>({
  sortComparer: (a: Task, b: Task) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.createAt.localeCompare(b.createAt);
  },
});

const initialState: TaskState = taskAdapter.getInitialState({
  fetch: {
    loading: false,
    error: null,
  },
  create: {
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null,
  },
  delete: {
    loading: false,
    error: null,
  },
});

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.create.loading = false;
        state.create.error = null;
        taskAdapter.addOne(state, action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload as string;
      })

      .addCase(fetchTask.pending, (state) => {
        state.fetch.loading = true;
        state.fetch.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.fetch.loading = false;
        state.fetch.error = null;
        taskAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.fetch.loading = false;
        state.fetch.error = action.payload as string;
      })

      .addCase(updateTask.pending, (state) => {
        state.update.loading = true;
        state.update.error = null;
      })
      .addCase(
        updateTask.fulfilled,
        (state, action: PayloadAction<UpdateTaskPayload>) => {
          state.update.loading = false;
          state.update.error = null;
          taskAdapter.updateOne(state, action.payload);
        },
      )
      .addCase(updateTask.rejected, (state, action) => {
        state.update.loading = false;
        state.update.error = action.payload as string;
      })

      .addCase(deleteTask.pending, (state) => {
        state.delete.loading = true;
        state.delete.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.delete.loading = false;
        state.delete.error = null;
        taskAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.delete.loading = false;
        state.delete.error = action.payload as string;
      });
  },
});

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
  selectEntities: selectTaskEntities,
} = taskAdapter.getSelectors((state: RootState) => state.tasks);

export const selectTasksByColumnId = createSelector(
  [selectAllTasks, (_: RootState, columnId: string) => columnId],
  (tasks, columnId) => {
    return tasks.filter((task) => task.columnId === columnId);
  },
);

export { createTask, fetchTask, updateTask, deleteTask };
export default taskSlice.reducer;
