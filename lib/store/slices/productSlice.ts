import {
  fetchProducts as fetchProd,
  fetchRandomDiscountProducts,
} from "@/lib/server/queries/products";
import { Product, FetchedProduct, FetchedDiscount } from "@/types/Product";
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export interface HotelsState {
  products: Product[];
  discountProduct: Product[];
  error: string | null;
  status: "idle" | "fulfilled" | "pending" | "error";
}

const initialState: HotelsState = {
  discountProduct: [],
  products: [],
  error: null,
  status: "idle",
};
const createSliceWithThunk = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
export const productSlice = createSliceWithThunk({
  name: "products",
  initialState,
  reducers: (create) => ({
    fetchProducts: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const { data, error }: FetchedProduct = await fetchProd();
          if (error) {
            return rejectWithValue(error.message); // Если есть ошибка, возвращаем ее
          }

          const discount: FetchedDiscount = await fetchRandomDiscountProducts();
          console.log(discount);
          if (!discount.discount || !Array.isArray(discount.discount)) {
            return { products: data };
          } else if (!data || !Array.isArray(data)) {
            return { discount: discount.discount };
          }

          return { products: data, discount: discount.discount };
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
            state.products = action.payload.products;
            state.status = "fulfilled";
            state.error = null;
          }
          if (action.payload.discount) {
            state.status = "fulfilled";
            state.discountProduct = action.payload.discount ?? [];
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

export const { fetchProducts } = productSlice.actions;

export default productSlice.reducer;
