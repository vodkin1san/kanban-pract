import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { db } from "@myFirebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getFirebaseErrorMessage } from "@utils/firebaseErrors";
import type { RootState } from "@store/index";

interface Column {
  id: string;
  name: string;
  userId: string;
  createAt: string;
}

const columnsAdapter = createEntityAdapter<Column>();

interface ColumnState
  extends ReturnType<typeof columnsAdapter.getInitialState> {
  isCreatingColumn: boolean;
  isFetchingColumns: boolean;
  error: string | null;
}

const initialState: ColumnState = columnsAdapter.getInitialState({
  isCreatingColumn: false,
  isFetchingColumns: false,
  error: null,
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

const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createColumn.pending, (state) => {
        state.isCreatingColumn = true;
        state.error = null;
      })
      .addCase(
        createColumn.fulfilled,
        (state, action: PayloadAction<Column>) => {
          state.isCreatingColumn = false;
          state.error = null;
          columnsAdapter.addOne(state, action.payload);
        },
      )
      .addCase(createColumn.rejected, (state, action) => {
        state.isCreatingColumn = false;
        state.error = action.payload as string;
      })
      .addCase(fetchColumn.pending, (state) => {
        state.isFetchingColumns = true;
        state.error = null;
      })
      .addCase(
        fetchColumn.fulfilled,
        (state, action: PayloadAction<Column[]>) => {
          state.isFetchingColumns = false;
          state.error = null;
          columnsAdapter.setAll(state, action.payload);
        },
      )
      .addCase(fetchColumn.rejected, (state, action) => {
        state.isFetchingColumns = false;
        state.error = action.payload as string;
        columnsAdapter.removeAll(state);
      });
  },
});

export const {
  selectAll: selectAllColumns,
  selectById: selectColumnById,
  selectIds: selectColumnIds,
} = columnsAdapter.getSelectors((state: RootState) => state.column);

export { createColumn, fetchColumn };
export default columnSlice.reducer;
