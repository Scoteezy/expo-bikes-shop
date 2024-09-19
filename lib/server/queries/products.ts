import { supabase } from "@/lib/server/supabase";
import { FetchedProduct } from "@/types/Product";
export const fetchProducts = async (): Promise<FetchedProduct> => {
  const { data, error, status } = await supabase
    .from("products")
    .select(
      `id,name,price,category,in_stock,image,description, discount(discount)`
    );
  const dataWithDiscount = data?.map((product) => {
    console.log(product.discount);
    return {
      ...product,
      // @ts-ignore
      discount: product.discount ? product.discount?.[0]?.discount : null,
    };
  });
  if (!dataWithDiscount) {
    return { data: [], error };
  }
  return { data: dataWithDiscount, error };
};
