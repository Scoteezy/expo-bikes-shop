import { getUserFavorite } from "@/lib/server/queries/favorite";
import { Product } from "@/types/Product";
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";

export interface FavoriteState {
  favorite: Product[];
  discountProduct: Product[];
  error: string | null;
  status: "idle" | "fulfilled" | "pending" | "error";
}

const initialState: FavoriteState = {
  discountProduct: [],
  favorite: [],
  error: null,
  status: "idle",
};
const createSliceWithThunk = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
export const favoriteSlice = createSliceWithThunk({
  name: "favorite",
  initialState,
  reducers: (create) => ({
    fetchFavorite: create.asyncThunk(
      async (session: Session, { rejectWithValue }) => {
        try {
          const data: Product[] | null = await getUserFavorite(session);
          if (data === null) {
            return rejectWithValue("Error"); // Если есть ошибка, возвращаем ее
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
            state.favorite = action.payload.products;
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
    makeFavoriteSync: create.reducer(
      (state, action: PayloadAction<Product>) => {
        const favProd = action.payload;
        state.favorite.push(favProd);
      }
    ),
    removeFavoriteSync: create.reducer(
      (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.favorite = state.favorite.filter((prod) => prod.id !== id);
      }
    ),
  }),
});

export const { fetchFavorite, makeFavoriteSync, removeFavoriteSync } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
