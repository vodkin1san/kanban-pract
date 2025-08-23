import { createAsyncThunk } from "@reduxjs/toolkit";
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
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "./taskTypes";

export const createTask = createAsyncThunk<
  Task,
  CreateTaskPayload,
  { rejectValue: string }
>(
  "task/createTask",
  async (taskData: CreateTaskPayload, { rejectWithValue }) => {
    try {
      const createAt = new Date().toISOString();
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        createAt: createAt,
      });
      return {
        id: docRef.id,
        ...taskData,
        createAt: createAt,
        description: taskData.description || null,
      };
    } catch (err) {
      const firebaseError = err as FirebaseError;
      return rejectWithValue(firebaseError.message);
    }
  },
);

export const updateTask = createAsyncThunk(
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

export const deleteTask = createAsyncThunk(
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

export const fetchTask = createAsyncThunk<
  Task[],
  string,
  { rejectValue: string }
>("task/fetchTask", async (userId: string, { rejectWithValue }) => {
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
      };
    });
    return tasks;
  } catch (err) {
    const firebaseError = err as FirebaseError;
    return rejectWithValue(firebaseError.message);
  }
});

export const updateTaskColumn = createAsyncThunk(
  "task/updateTaskColumn",
  async (
    {
      taskId,
      newColumnId,
      newIndex,
    }: { taskId: string; newColumnId: string; newIndex: number },
    { rejectWithValue },
  ) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        columnId: newColumnId,
        order: newIndex,
      });

      return { taskId, newColumnId };
    } catch (err) {
      const firebaseError = err as FirebaseError;
      return rejectWithValue(firebaseError.message);
    }
  },
);

export const reorderTaskInColumn = createAsyncThunk(
  "task/reorderTaskInColumn",
  async (
    { taskId, newIndex }: { taskId: string; newIndex: number },
    { rejectWithValue },
  ) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        order: newIndex,
      });

      return { taskId, newIndex };
    } catch (err) {
      const firebaseError = err as FirebaseError;
      return rejectWithValue(firebaseError.message);
    }
  },
);
