import { PostgrestError } from "@supabase/supabase-js";

export type User = {
  id: string;
  full_name: string;
  avatar_url: string;
  phone: string;
};
export type FetchedUser = {
  data: User | null;
  error: PostgrestError | null;
};
export type UpdateUser = {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
};
