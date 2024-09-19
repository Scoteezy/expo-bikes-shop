import { PostgrestError } from "@supabase/supabase-js";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  in_stock: boolean;
  image: string;
  description: string;
  discount?: number;
};
export type FetchedProduct = {
  data: Product[] | null;
  error: PostgrestError | null;
};
