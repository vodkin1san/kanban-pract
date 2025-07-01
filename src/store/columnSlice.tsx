import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";
import type { RootState } from "../store";

interface Column {
  id: string;
  name: string;
  userId: string;
  createAt: string;
}

const columnsAdapter = createEntityAdapter<Column>({
  selectId: (column: Column) => column.id,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

interface ColumnState
  extends ReturnType<typeof columnsAdapter.getInitialState> {
  isLoading: boolean;
  error: string | null;
}

const initialState: ColumnState = columnsAdapter.getInitialState({
  isLoading: false,
  error: null,
});

const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createColumn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createColumn.fulfilled,
        (state, action: PayloadAction<Column>) => {
          state.isLoading = false;
          state.error = null;
          columnsAdapter.addOne(state, action.payload);
        },
      )
      .addCase(createColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          "Неизвестная ошибка при создании колонки";
      })
      .addCase(fetchColumn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchColumn.fulfilled,
        (state, action: PayloadAction<Column[]>) => {
          state.isLoading = false;
          state.error = null;
          columnsAdapter.setAll(state, action.payload);
        },
      )
      .addCase(fetchColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          "Неизвестная ошибка при создании колонки";
        columnsAdapter.removeAll(state);
      });
  },
});

const createColumn = createAsyncThunk(
  "columns/createColumn",
  async (
    { name, userId }: { name: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      const docRef = await addDoc(collection(db, "columns"), {
        name,
        userId,
        createAt: new Date().toISOString(),
      });
      return {
        id: docRef.id,
        name,
        userId,
        createAt: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  },
);

const fetchColumn = createAsyncThunk(
  "columns/fetchColumns",
  async (userId: string, { rejectWithValue }) => {
    try {
      const columnCollectionRef = collection(db, "columns");
      const q = query(columnCollectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const columns: Column[] = [];
      querySnapshot.forEach((doc) => {
        columns.push({
          id: doc.id,
          name: doc.data().name,
          userId: doc.data().userId,
          createAt: doc.data().createAt,
        });
      });
      return columns;
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  },
);

export const {
  selectAll: selectAllColumns,
  selectById: selectColumnById,
  selectIds: selectColumnIds,
} = columnsAdapter.getSelectors((state: RootState) => state.column);

export { createColumn, fetchColumn };
export default columnSlice.reducer;
