import { configureStore } from "@reduxjs/toolkit";
import jobsListReducer from "./features/jobsListSlice";

export const store = configureStore({
  reducer: {
    jobsList: jobsListReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
