import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

interface Column {
  id: string;
  name: string;
  userId: string;
  createAt: string;
}

interface ColumnState {
  items: Column[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ColumnState = {
  items: [],
  isLoading: false,
  error: null,
};

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
      .addCase(createColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items.push(action.payload);
      })
      .addCase(createColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Неизвестная ошибка при создании колонки";
      })
      .addCase(fetchColumn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Неизвестная ошибка при создании колонки";
      });
  },
});

const createColumn = createAsyncThunk(
  "columns/createColumn",
  async ({ name, userId }: { name: string; userId: string }) => {
    const docRef = await addDoc(collection(db, "columns"), {
      name,
      userId,
      createAt: new Date().toISOString(),
    });
    return { id: docRef.id, name, userId, createAt: new Date().toISOString() };
  }
);

const fetchColumn = createAsyncThunk("columns/fetchColumns", async (userId: string) => {
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
});

export { createColumn, fetchColumn };
export default columnSlice.reducer;
