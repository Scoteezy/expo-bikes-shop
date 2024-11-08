import { fetchUserInfo, updateUserInfo } from "@/lib/server/queries/user";
import { FetchedUser, UpdateUser } from "@/types/User";
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";

export type userState = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  phone: number;
  status: string;
  email: string;
  error: unknown;
};

const initialState: userState = {
  id: "",
  avatar_url: "",
  username: "",
  full_name: "",
  phone: 0,
  status: "",
  email: "",
  error: null,
};
const createSliceWithThunk = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
export const userSlice = createSliceWithThunk({
  name: "user",
  initialState,
  reducers: (create) => ({
    fetchUser: create.asyncThunk(
      async (session: Session) => {
        try {
          const { data }: FetchedUser = await fetchUserInfo(session);
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
            Object.assign(state, action.payload);
          }
        },
        rejected: (state) => {
          (state.status = "finished"), (state.error = "error");
        },
      }
    ),
    updateUser: create.asyncThunk(
      async ({ updates, id }: { updates: UpdateUser; id: string }) => {
        try {
          console.log("asdasd");
          const { data }: FetchedUser = await updateUserInfo(updates, id);
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
            Object.assign(state, action.payload);
          }
        },
        rejected: (state) => {
          (state.status = "finished"), (state.error = "error");
        },
      }
    ),
  }),
});

// Action creators are generated for each case reducer function
export const { fetchUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
