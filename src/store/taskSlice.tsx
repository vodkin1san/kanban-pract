import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { db } from "@myFirebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { FirebaseError } from "firebase/app";
import type { RootState } from "@store/index";

interface Task {
  id: string;
  title: string;
  description: string;
  createAt: string;
  dueDate: string | null;
  columnId: string | null;
  userId: string;
}

const taskAdapter = createEntityAdapter<Task>({
  sortComparer: (a: Task, b: Task) => a.createAt.localeCompare(b.createAt),
});

export interface TaskState {
  isLoading: boolean;
  error: string | null;
  ids: string[];
  entities: Record<string, Task>;
}

const initialState: TaskState = taskAdapter.getInitialState({
  isLoading: false,
  error: null,
});

interface CreateTaskPayload {
  title: string;
  description: string;
  dueDate: string | null;
  columnId: string | null;
  userId: string;
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
      } as Task;
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
      const tasks: Task[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
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
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.error = null;
        taskAdapter.addOne(state, action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        taskAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
  selectEntities: selectTaskEntities,
} = taskAdapter.getSelectors((state: RootState) => state.task);

export { createTask, fetchTask };
export default taskSlice.reducer;
