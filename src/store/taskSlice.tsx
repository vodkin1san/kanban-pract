import {
  createSlice,
  createSelector,
  createEntityAdapter,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { db } from "@myFirebase/config";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import type { FirebaseError } from "firebase/app";
import type { RootState } from "@store/index";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  createAt: string;
  dueDate: string | null;
  columnId: string | null;
  userId: string;
  order: number;
}

const taskAdapter = createEntityAdapter<Task>({
  sortComparer: (a: Task, b: Task) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.createAt.localeCompare(b.createAt);
  },
});

export interface TaskState {
  fetch: {
    loading: boolean;
    error: string | null;
  };

  create: {
    loading: boolean;
    error: string | null;
  };

  update: {
    loading: boolean;
    error: string | null;
  };

  delete: {
    loading: boolean;
    error: string | null;
  };
  ids: string[];
  entities: Record<string, Task>;
}

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

interface CreateTaskPayload {
  title: string;
  description: string | null;
  dueDate: string | null;
  columnId: string | null;
  userId: string;
  order: number;
}

interface UpdateTaskPayload {
  id: string;
  changes: Partial<Task>;
}

const createTask = createAsyncThunk(
  "task/createTask",
  async (taskData: CreateTaskPayload, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        createAt: new Date().toISOString(),
      });
      return {
        id: docRef.id,
        ...taskData,
        createAt: new Date().toISOString(),
        description: taskData.description || null,
      } as Task;
    } catch (err) {
      const firebaseError = err as FirebaseError;
      return rejectWithValue(firebaseError.message);
    }
  },
);

const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ id, changes }: UpdateTaskPayload, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "tasks", id), changes);
      return {
        id,
        changes,
      };
    } catch (err) {
      const firebaseError = err as FirebaseError;
      return rejectWithValue(firebaseError.message);
    }
  },
);

const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      return id;
    } catch (err) {
      const firebaseError = err as FirebaseError;
      return rejectWithValue(firebaseError.message);
    }
  },
);

const fetchTask = createAsyncThunk(
  "task/fetchTask",
  async (userId: string, { rejectWithValue }) => {
    try {
      const taskCollectionRef = collection(db, "tasks");
      const q = query(taskCollectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description || null,
          createAt: data.createAt,
          dueDate: data.dueDate || null,
          columnId: data.columnId || null,
          userId: data.userId,
          order: data.order ?? 0,
        } as Task;
      });
      return tasks;
    } catch (err) {
      const firebaseError = err as FirebaseError;
      return rejectWithValue(firebaseError.message);
    }
  },
);

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
