import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userProfileReducer from "./userProfileSlice";
import columnReducer from "./columnSlice";
import taskReducer from "./tasks/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userProfile: userProfileReducer,
    column: columnReducer,
    tasks: taskReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
