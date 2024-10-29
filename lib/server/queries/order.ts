import { CartProduct } from "@/types/Product";
import { supabase } from "../supabase";
import { FetchedOrder, Order } from "@/types/Order";
export async function getUserOrders(): Promise<FetchedOrder> {
  // Получаем текущего пользователя
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    console.error("Пользователь не авторизован");
    return { data: null, error: null };
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
          id,
          created_at,
          user_id,
          status,
          total,
          address,
          order_items (*)
        `
    )
    .eq("user_id", user.data.user.id);

  if (ordersError) {
    console.error("Ошибка при получении заказов и их элементов:", ordersError);
    return { data: null, error: ordersError };
  }

  if (!orders?.length) {
    console.log("Заказы не найдены");
    return { data: [], error: null };
  }

  const productIds = orders
    .flatMap((order) => order.order_items.map((item) => item.product_id))
    .filter((id, index, self) => self.indexOf(id) === index);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,name")
    .in("id", productIds);

  if (productsError) {
    console.error("Ошибка при получении продуктов:", productsError);
    return { data: null, error: productsError };
  }

  const dataWithProducts: Order[] = orders.map((order) => ({
    ...order,
    order_items: order.order_items.map((item) => ({
      quantity: item.quantity,
      product: products?.find((product) => product.id === item.product_id)
        ?.name,
    })),
  }));

  console.log(dataWithProducts[0]);

  return { data: dataWithProducts, error: null };
}

export async function createOrderWithItems(
  total: number,
  items: CartProduct[]
) {
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    console.error("Пользователь не авторизован");
    return { data: null, error: null };
  }
  try {
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.data.user.id,
          total,
        },
      ])
      .select("id,created_at,user_id, status, total, address")
      .single();

    if (orderError) {
      console.error("Ошибка при создании заказа:", orderError);
      return { data: null, error: orderError };
    }

    const orderId = orderData.id;

    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
    }));

    const { data: orderItemsData, error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select("id,quantity, product_id");
    if (orderItemsError) {
      console.error("Ошибка при создании элементов заказа:", orderItemsError);
      return { data: null, error: orderItemsError };
    }
    const productIds = orderItems
      .map((item) => item.product_id)
      .filter((id, index, self) => self.indexOf(id) === index);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id,name")
      .in("id", productIds);
    if (orderItemsError) {
      console.error("Ошибка при получении продуктов:", orderItemsError);
      return { data: null, error: orderItemsError };
    }
    const dataWithProducts: Order = {
      ...orderData,
      order_items: orderItemsData.map((item) => {
        console.log(item);
        return {
          quantity: item.quantity,
          product: products?.find((product) => product.id === item.product_id)
            ?.name,
        };
      }),
    };

    return { data: dataWithProducts, error: null };
  } catch (error) {
    return { data: null, error: null };
  }
}
