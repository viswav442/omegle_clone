import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["peer/signal"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.peer"],
        // Ignore these paths in the state
        ignoredPaths: ["chat.peer"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Hooks for TypeScript support (even in JavaScript)
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Infer the `RootState` and `AppDispatch` types from the store itself
export const RootState = store.getState();
export const AppDispatch = store.dispatch;
