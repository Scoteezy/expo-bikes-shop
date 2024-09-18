import { fetchProducts as fetchProd } from "@/lib/server/queries/products";
import { Product, FetchedProduct } from "@/types/Product";
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export interface HotelsState {
  products: Product[];
  error: string | null;
  status: string;
}

const initialState: HotelsState = {
  products: [],
  error: null,
  status: "",
};
const createSliceWithThunk = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
export const productSlice = createSliceWithThunk({
  name: "hotels",
  initialState,
  reducers: (create) => ({
    fetchProducts: create.asyncThunk(
      async () => {
        try {
          const { data, error }: FetchedProduct = await fetchProd();
          if (error) throw new Error(error.message);
          return data;
        } catch (e) {
          throw e;
        }
      },
      {
        pending: (state) => {
          (state.status = "loading"), (state.error = null);
        },
        fulfilled: (state, action) => {
          if (action.payload) {
            state.products = action.payload;
            state.status = "finished";
            state.error = null;
          }
        },
        rejected: (state) => {
          (state.status = "finished"), (state.error = "error");
        },
      }
    ),
  }),
});

export const { fetchProducts } = productSlice.actions;

export default productSlice.reducer;
