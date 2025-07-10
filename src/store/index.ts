import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import columnReducer from "./columnSlice";
import taskReducer from "./taskSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    column: columnReducer,
    task: taskReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
