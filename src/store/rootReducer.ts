import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userProfileReducer from "./userProfileSlice";
import columnReducer from "./columnSlice";
import taskReducer from "./taskSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  column: columnReducer,
  tasks: taskReducer,
});

export default rootReducer;
