import { supabase } from "@/lib/server/supabase";
import { FetchedDiscount, FetchedProduct } from "@/types/Product";
export const fetchProducts = async (): Promise<FetchedProduct> => {
  const { data, error, status } = await supabase
    .from("products")
    .select(`id,name,price,category,in_stock,image`);
  return { data, error };
};
export const fetchRandomDiscountProducts =
  async (): Promise<FetchedDiscount> => {
    const { data: discountData, error: discountError } = await supabase
      .from("discount")
      .select(`product_id, discount`); // Выбираем также поле со скидкой

    if (discountError) {
      console.log("Error fetching discount products:", discountError.message);
      return { discount: null, error: discountError };
    }

    if (discountData && discountData.length > 0) {
      // Перемешиваем данные и выбираем 3 случайных продукта
      const shuffledProducts = discountData.sort(() => 0.5 - Math.random());
      const selectedProductIds = shuffledProducts
        .slice(0, 3)
        .map((item) => item.product_id);

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`id, name, price, category, in_stock, image`)
        .in("id", selectedProductIds);

      if (productsError) {
        console.log("Error fetching products:", productsError.message);
        return { discount: null, error: productsError };
      }

      // Добавляем поле со скидкой к каждому продукту
      const productsWithDiscount = productsData.map((product) => {
        const discountInfo = discountData.find(
          (discountItem) => discountItem.product_id === product.id
        );
        return {
          ...product,
          discount: discountInfo ? discountInfo.discount : null, // Добавляем скидку
        };
      });

      console.log(productsWithDiscount);
      return { discount: productsWithDiscount, error: null };
    }

    return { discount: [], error: null };
  };
