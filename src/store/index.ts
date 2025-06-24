import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import columnReducer from "./columnSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    column: columnReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
