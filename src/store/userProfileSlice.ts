import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserProfileState {
  uid: string | null;
  email: string | null;
}

const initialState: UserProfileState = {
  uid: null,
  email: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ uid: string | null; email: string | null }>,
    ) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
    },

    clearUser: (state) => {
      state.uid = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = userProfileSlice.actions;
export default userProfileSlice.reducer;
