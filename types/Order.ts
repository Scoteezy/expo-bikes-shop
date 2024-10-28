import { PostgrestError } from "@supabase/supabase-js";

export type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  address: string;
  created_at: Date;
  order_items: {
    product: string;
    quantity: number;
  }[];
};
export type FetchedOrder = {
  data: Order[] | null;
  error: PostgrestError | null;
};
