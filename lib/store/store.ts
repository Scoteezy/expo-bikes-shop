import { combineReducers, configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./slices/sessionSlice";
import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productSlice";
export const rootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  products: productsReducer,
});
export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
