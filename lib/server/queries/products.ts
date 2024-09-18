import { supabase } from "@/lib/server/supabase";
import { FetchedProduct } from "@/types/Product";
import { Session } from "@supabase/supabase-js";
export const fetchProducts = async (): Promise<FetchedProduct> => {
  const { data, error, status } = await supabase
    .from("products")
    .select(`id,name,price,category,in_stock,image`);
  return { data, error };
};
