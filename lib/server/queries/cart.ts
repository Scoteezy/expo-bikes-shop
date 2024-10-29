import { PostgrestError, Session } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { CartProduct } from "@/types/Product";
export const getUserCart = async (
  session: Session
): Promise<{ data: CartProduct[] | null; error: PostgrestError | null }> => {
  try {
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("product_id,quantity")
      .eq("user_id", session?.user.id);

    if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return { data: null, error: cartError };
    }
    if (!cartData || cartData.length === 0) {
      return { data: [], error: null };
    }
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
      console.error("Error fetching poducts:", productsError.message);
      return { data: null, error: productsError };
    }
    const dataWithQuantityAndDiscount = productsData?.map((product) => {
      const cartItem = cartData.find((item) => item.product_id === product.id);
      return {
        ...product,
        // @ts-ignore
        discount: product.discount ? product.discount?.[0]?.discount : null,
        quantity: cartItem ? cartItem.quantity : 1,
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
      let newQuantity = existingItem.quantity + 1;
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)
        .select("*");
      if (error) {
        console.error("Error updating cart item:", error.message);
        return { data: null, error };
      }

      result = data;
    } else {
      const { data, error } = await supabase
        .from("cart")
        .insert([
          {
            user_id: userId,
            product_id: productId,
            quantity: 1,
          },
        ])
        .select("*");
      if (error) {
        console.error("Error adding to cart:", error.message);
        return { data: null, error };
      }

      result = data;
    }
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("product_id,quantity")
      .eq("user_id", userId);

    if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return { data: null, error: cartError };
    }
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

export const removeFromCart = async (
  userId: string,
  productId: string
): Promise<{ data: CartProduct[] | null; error: PostgrestError | null }> => {
  try {
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
      return { data: null, error: null };
    }
    if (existingItem.quantity > 1) {
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
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("product_id,quantity")
      .eq("user_id", userId);

    if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return { data: null, error: cartError };
    }
    if (!cartData || cartData.length === 0) {
      return { data: [], error: null };
    }
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
