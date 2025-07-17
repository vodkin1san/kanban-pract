import type { RootState } from "./index";

export const selectUserId = (state: RootState) => state.userProfile.uid;

export const selectAuthError = (state: RootState) => state.auth.error;
