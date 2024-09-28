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
  productId: string
): Promise<{ data: null | CartProduct[]; error: PostgrestError | null }> => {
  try {
    // Check if the product is already in the cart
    const { data: existingItem, error: fetchError } = await supabase
      .from("cart")
      .select("quantity,id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking cart item:", fetchError.message);
      return { data: null, error: fetchError };
    }

    let result;

    if (existingItem) {
      // If the product is already in the cart, increase its quantity
      let newQuantity = existingItem.quantity + 1;

      // Use update to modify the quantity and return the updated row
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)
        .select("*"); // Return all columns after the update

      if (error) {
        console.error("Error updating cart item:", error.message);
        return { data: null, error };
      }

      result = data;
    } else {
      // If the product is not in the cart, insert it and return the inserted row
      const { data, error } = await supabase
        .from("cart")
        .insert([
          {
            user_id: userId,
            product_id: productId,
            quantity: 1,
          },
        ])
        .select("*"); // Return all columns after the insert

      if (error) {
        console.error("Error adding to cart:", error.message);
        return { data: null, error };
      }

      result = data;
    }

    // Fetch the updated cart for the user
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("product_id,quantity")
      .eq("user_id", userId);

    if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return { data: null, error: cartError };
    }

    // Fetch the products from the cart
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

    // Map the products data with quantity and discount
    const dataWithQuantityAndDiscount = productsData?.map((product) => {
      const cartItem = cartData.find((item) => item.product_id === product.id);
      return {
        ...product,
        // Handle discount field safely
        discount: product.discount ? product.discount?.[0]?.discount : null,
        quantity: cartItem ? cartItem.quantity : 1,
      };
    });

    return { data: dataWithQuantityAndDiscount, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: error as PostgrestError };
  }
};

export const removeFromCart = async (
  userId: string,
  productId: string
): Promise<{ data: CartProduct[] | null; error: PostgrestError | null }> => {
  try {
    // Fetch the current quantity of the product in the cart
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
      return { data: null, error: null }; // If the product is not in the cart
    }

    if (existingItem.quantity > 1) {
      // If the quantity is more than one, decrement the quantity
      const { error } = await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity - 1 })
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) {
        console.error("Error updating cart item:", error.message);
        return { data: null, error };
      }
    } else {
      // If the quantity is one, remove the item from the cart
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) {
        console.error("Error deleting cart item:", error.message);
        return { data: null, error };
      }
    }

    // Fetch the updated cart for the user
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("product_id,quantity")
      .eq("user_id", userId);

    if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return { data: null, error: cartError };
    }

    // If the cart is empty, return an empty array
    if (!cartData || cartData.length === 0) {
      return { data: [], error: null };
    }

    // Fetch product details for the items in the cart
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

    // Map the product data with the quantity and discount from the cart
    const dataWithQuantityAndDiscount = productsData?.map((product) => {
      const cartItem = cartData.find((item) => item.product_id === product.id);
      return {
        ...product,
        discount: product.discount ? product.discount?.[0]?.discount : null,
        quantity: cartItem ? cartItem.quantity : 1,
      };
    });

    return { data: dataWithQuantityAndDiscount, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: error as PostgrestError };
  }
};
