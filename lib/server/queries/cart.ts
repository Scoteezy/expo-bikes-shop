import { PostgrestError, Session } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { CartProduct } from "@/types/Product";

export const getUserCart = async (
  session: Session
): Promise<{ data: CartProduct[] | null; error: PostgrestError | null }> => {
  try {
    // Получаем список товаров из корзины для пользователя
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("product_id,quantity")
      .eq("user_id", session?.user.id);

    if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return { data: null, error: cartError };
    }
    // Проверяем, есть ли товары в корзине
    if (!cartData || cartData.length === 0) {
      return { data: [], error: null }; // Возвращаем пустой массив, если товаров нет
    }

    // Получаем продукты по их id
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(
        `id,name,price,category,in_stock,image,description, discount(discount)`
      )
      .in(
        "id",
        cartData.map((item) => item.product_id)
      );

    if (productsError) {
      console.error("Error fetching products:", productsError.message);
      return { data: null, error: productsError };
    }

    // Сопоставляем данные продуктов с количеством из корзины
    const dataWithQuantityAndDiscount = productsData?.map((product) => {
      const cartItem = cartData.find((item) => item.product_id === product.id);
      return {
        ...product,
        // @ts-ignore
        discount: product.discount ? product.discount?.[0]?.discount : null,
        quantity: cartItem ? cartItem.quantity : 1, // Добавляем количество товара из корзины
      };
    });
    console.log(dataWithQuantityAndDiscount);
    return { data: dataWithQuantityAndDiscount, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: error as PostgrestError };
  }
};
export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1
): Promise<{ data: null | CartProduct[]; error: PostgrestError | null }> => {
  try {
    // Проверяем, есть ли этот товар уже в корзине
    const { data: existingItem, error: fetchError } = await supabase
      .from("cart")
      .select("quantity,id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();
    console.log(existingItem);
    console.log(fetchError);
    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking cart item:", fetchError.message);
      return { data: null, error: fetchError };
    }

    let newQuantity = quantity;

    if (existingItem) {
      // Если товар уже в корзине, увеличиваем количество
      newQuantity += existingItem.quantity;
    }

    // Используем upsert для обновления количества или вставки нового товара
    const { data, error } = await supabase.from("cart").upsert([
      {
        id: existingItem?.id,
        user_id: userId,
        product_id: productId,
        quantity: newQuantity,
      },
    ]);

    if (error) {
      console.error("Error adding to cart:", error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: error as PostgrestError };
  }
};
export const removeFromCart = async (
  userId: string,
  productId: string
): Promise<{ data: null | CartProduct[]; error: PostgrestError | null }> => {
  try {
    // Получаем текущее количество товара в корзине
    const { data: existingItem, error: fetchError } = await supabase
      .from("cart")
      .select("quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (fetchError) {
      console.error("Error checking cart item:", fetchError.message);
      return { data: null, error: fetchError };
    }

    if (!existingItem) {
      return { data: null, error: null }; // Если товара нет в корзине
    }

    if (existingItem.quantity > 1) {
      // Если больше одного, уменьшаем количество
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity - 1 })
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) {
        console.error("Error updating cart item:", error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } else {
      // Если количество товара 1, удаляем его из корзины
      const { data, error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) {
        console.error("Error deleting cart item:", error.message);
        return { data: null, error };
      }

      return { data, error: null };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: error as PostgrestError };
  }
};