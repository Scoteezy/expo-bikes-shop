import { PostgrestError } from "@supabase/supabase-js";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  in_stock: number;
  image: string;
  description: string;
  discount?: number;
}
export type FetchedProduct = {
  data: Product[] | null;
  error: PostgrestError | null;
};
export interface CartProduct extends Product {
  quantity: number;
}
export type FetchedCart = {
  data: CartProduct[] | null;
  error: PostgrestError | null;
};
