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
  isLoadingTasks: boolean;
  isCreatingTask: boolean;
  isUpdatingTask: boolean;
  isDeletingTask: boolean;
  error: string | null;
  ids: string[];
  entities: Record<string, Task>;
}

const initialState: TaskState = taskAdapter.getInitialState({
  isLoadingTasks: false,
  isCreatingTask: false,
  isUpdatingTask: false,
  isDeletingTask: false,
  error: null,
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
        state.isCreatingTask = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isCreatingTask = false;
        state.error = null;
        taskAdapter.addOne(state, action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isCreatingTask = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTask.pending, (state) => {
        state.isLoadingTasks = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoadingTasks = false;
        taskAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.isLoadingTasks = false;
        state.error = action.payload as string;
      })
      .addCase(updateTask.pending, (state) => {
        state.isUpdatingTask = true;
        state.error = null;
      })
      .addCase(
        updateTask.fulfilled,
        (state, action: PayloadAction<UpdateTaskPayload>) => {
          state.isUpdatingTask = false;
          state.error = null;
          taskAdapter.updateOne(state, action.payload);
        },
      )
      .addCase(updateTask.rejected, (state, action) => {
        state.isUpdatingTask = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTask.pending, (state) => {
        state.isDeletingTask = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.isDeletingTask = false;
        state.error = null;
        taskAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isDeletingTask = false;
        state.error = action.payload as string;
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
