import { Session } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { Product } from "@/types/Product";

export const checkFavorite = async (session: Session, product_id: string) => {
  const { data, error, status } = await supabase
    .from("favorites")
    .select(`id`)
    .eq("user_id", session?.user.id)
    .eq("product_id", product_id);

  if (data && data.length > 0) {
    return true;
  } else {
    return false;
  }
};
export const makeFavorite = async (session: Session, product_id: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id: session?.user.id, product_id }])
    .select();
  return error;
};
export const removeFavorite = async (session: Session, product_id: string) => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", session?.user.id)
    .eq("product_id", product_id);
  return error;
};
export const getUserFavorite = async (session: Session) => {
  try {
    // Получаем список избранных продуктов для пользователя
    const { data: favoriteData, error: favoriteError } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", session?.user.id);

    if (favoriteError) {
      console.error("Error fetching favorites:", favoriteError.message);
      return null;
    }

    // Проверяем, есть ли избранные товары
    if (!favoriteData || favoriteData.length === 0) {
      return []; // Возвращаем пустой массив, если нет избранных товаров
    }

    // Получаем продукты по их id
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(
        `id,name,price,category,in_stock,image,description, discount(discount)`
      )
      .in(
        "id",
        favoriteData.map((fav) => fav.product_id)
      );

    if (productsError) {
      console.error("Error fetching products:", productsError.message);
      return null;
    }
    const dataWithDiscount = productsData?.map((product) => {
      console.log(product.discount);
      return {
        ...product,
        // @ts-ignore
        discount: product.discount ? product.discount?.[0]?.discount : null,
      };
    });
    return dataWithDiscount as Product[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};
