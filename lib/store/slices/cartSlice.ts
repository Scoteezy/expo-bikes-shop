import {
  addToCart as addToCartQuery,
  getUserCart,
  removeFromCart as removeFromCartQuery,
} from "@/lib/server/queries/cart";
import { FetchedCart, CartProduct } from "@/types/Product";
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";

export interface CartSlice {
  cart: CartProduct[];
  error: string | null;
  status: "idle" | "fulfilled" | "pending" | "error";
}

const initialState: CartSlice = {
  cart: [],
  error: null,
  status: "idle",
};
const createSliceWithThunk = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
export const cartSlice = createSliceWithThunk({
  name: "cart",
  initialState,
  reducers: (create) => ({
    fetchCart: create.asyncThunk(
      async (session: Session, { rejectWithValue }) => {
        try {
          const { data, error }: FetchedCart = await getUserCart(session);
          if (error) {
            return rejectWithValue(error.message); // Если есть ошибка, возвращаем ее
          }
          return { products: data };
        } catch (e) {
          console.log(e);
          return rejectWithValue(
            e instanceof Error ? e.message : "Unknown error"
          );
        }
      },
      {
        pending: (state) => {
          state.status = "pending";
          state.error = null;
        },
        fulfilled: (state, action) => {
          if (action.payload.products) {
            state.cart = action.payload.products;
            state.status = "fulfilled";
            state.error = null;
          }
        },
        rejected: (state, action) => {
          state.status = "error";
          state.error = "An unknown error occurred";
        },
      }
    ),
    addToCart: create.asyncThunk(
      async (
        { session, productId }: { session: Session; productId: string },
        { rejectWithValue }
      ) => {
        try {
          const { data, error }: FetchedCart = await addToCartQuery(
            session.user.id,
            productId
          );
          if (error) {
            return rejectWithValue(error.message); // Если есть ошибка, возвращаем ее
          }
          return { products: data };
        } catch (e) {
          console.log(e);
          // Любая другая непредвиденная ошибка
          return rejectWithValue(
            e instanceof Error ? e.message : "Unknown error"
          );
        }
      },
      {
        pending: (state) => {
          state.status = "pending";
          state.error = null;
        },
        fulfilled: (state, action) => {
          if (action.payload.products) {
            state.cart = action.payload.products;
            state.status = "fulfilled";
            state.error = null;
          }
        },
        rejected: (state, action) => {
          state.status = "error";
          state.error = "An unknown error occurred";
        },
      }
    ),
    removeFromCart: create.asyncThunk(
      async (
        { session, productId }: { session: Session; productId: string },
        { rejectWithValue }
      ) => {
        try {
          const { data, error }: FetchedCart = await removeFromCartQuery(
            session.user.id,
            productId
          );
          if (error) {
            return rejectWithValue(error.message); // Если есть ошибка, возвращаем ее
          }
          return { products: data };
        } catch (e) {
          console.log(e);
          // Любая другая непредвиденная ошибка
          return rejectWithValue(
            e instanceof Error ? e.message : "Unknown error"
          );
        }
      },
      {
        pending: (state) => {
          state.status = "pending";
          state.error = null;
        },
        fulfilled: (state, action) => {
          if (action.payload.products) {
            state.cart = action.payload.products;
            state.status = "fulfilled";
            state.error = null;
          }
        },
        rejected: (state, action) => {
          state.status = "error";
          state.error = "An unknown error occurred";
        },
      }
    ),
  }),
});

export const { fetchCart, addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
