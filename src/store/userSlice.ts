import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";
import { signOut } from "firebase/auth";

interface UserState {
  uid: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  uid: null,
  email: null,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
    return undefined;
  } catch (error) {
    const errorMessage = getFirebaseErrorMessage(error);
    return rejectWithValue(errorMessage);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ uid: string | null; email: string | null }>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.isLoading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.uid = null;
        state.email = null;
        state.error = action.payload as string;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.uid = null;
        state.email = null;
        state.error = action.payload as string;
      });
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.uid = null;
        state.email = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
