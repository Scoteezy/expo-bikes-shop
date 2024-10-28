import {
  createOrderWithItems,
  getUserOrders,
} from "@/lib/server/queries/order";
import { FetchedOrder, Order } from "@/types/Order";
import { CartProduct } from "@/types/Product";
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { PostgrestError } from "@supabase/supabase-js";

export interface OrderSlice {
  orders: Order[];
  error: string | null;
  status: "idle" | "fulfilled" | "pending" | "error";
}

const initialState: OrderSlice = {
  orders: [],
  error: null,
  status: "idle",
};
const createSliceWithThunk = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
export const orderSlice = createSliceWithThunk({
  name: "order",
  initialState,
  reducers: (create) => ({
    fetchOrders: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const { data, error }: FetchedOrder = await getUserOrders();
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
            state.orders = action.payload.products;
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
    createOrder: create.asyncThunk(
      async (
        { total, products }: { total: number; products: CartProduct[] },
        { rejectWithValue }
      ) => {
        try {
          const {
            data,
            error,
          }: { data: Order | null; error: PostgrestError | null } =
            await createOrderWithItems(total, products);
          console.log(products);

          if (error || !data) {
            return rejectWithValue(error?.message); // Если есть ошибка, возвращаем ее
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
            state.orders = [...state.orders, action.payload.products];
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

export const { fetchOrders, createOrder } = orderSlice.actions;

export default orderSlice.reducer;
