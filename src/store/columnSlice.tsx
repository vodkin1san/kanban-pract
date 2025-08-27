import {
  createSlice,
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
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseErrorMessage } from "@utils/firebaseErrors";
import type { RootState } from "@store/index";

export interface Column {
  id: string;
  name: string;
  userId: string;
  createAt: string;
}

export interface UpdateColumnPayload {
  id: string;
  changes: Partial<Column>;
}

const columnsAdapter = createEntityAdapter<Column>();

interface ColumnState
  extends ReturnType<typeof columnsAdapter.getInitialState> {
  isCreatingColumn: boolean;
  isFetchingColumns: boolean;
  error: string | null;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedColumnId: string | null;
}

const initialState: ColumnState = columnsAdapter.getInitialState({
  isCreatingColumn: false,
  isFetchingColumns: false,
  error: null,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  selectedColumnId: null,
});

const createColumn = createAsyncThunk(
  "column/createColumn",
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
  "column/fetchColumns",
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

const deleteColumn = createAsyncThunk(
  "column/deleteColumn",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "columns", id));

      return id;
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  },
);

const updateColumn = createAsyncThunk(
  "column/updateColumn",
  async ({ id, changes }: UpdateColumnPayload, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "columns", id), changes);
      return {
        id,
        changes,
      };
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  },
);

const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    openEditModal: (state, action: PayloadAction<string | null>) => {
      state.isEditModalOpen = true;
      state.selectedColumnId = action.payload;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedColumnId = null;
    },
    openDeleteModal: (state, action: PayloadAction<string>) => {
      state.isDeleteModalOpen = true;
      state.selectedColumnId = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.selectedColumnId = null;
    },
  },
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
      })
      .addCase(deleteColumn.pending, (state) => {
        state.isFetchingColumns = true;
        state.error = null;
      })
      .addCase(
        deleteColumn.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isFetchingColumns = false;
          state.error = null;
          columnsAdapter.removeOne(state, action.payload);
        },
      )
      .addCase(deleteColumn.rejected, (state, action) => {
        state.isFetchingColumns = false;
        state.error = action.payload as string;
      })
      .addCase(updateColumn.pending, (state) => {
        state.isFetchingColumns = true;
        state.error = null;
      })
      .addCase(
        updateColumn.fulfilled,
        (state, action: PayloadAction<UpdateColumnPayload>) => {
          state.isFetchingColumns = false;
          state.error = null;
          columnsAdapter.updateOne(state, action.payload);
        },
      )
      .addCase(updateColumn.rejected, (state, action) => {
        state.isFetchingColumns = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectAll: selectAllColumns,
  selectById: selectColumnById,
  selectIds: selectColumnIds,
} = columnsAdapter.getSelectors((state: RootState) => state.column);

export const {
  openEditModal,
  closeEditModal,
  openDeleteModal,
  closeDeleteModal,
} = columnSlice.actions;

export { createColumn, fetchColumn, deleteColumn, updateColumn };
export default columnSlice.reducer;
