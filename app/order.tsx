import TitleHeader from "@/components/Header/TitleHeader";
import GlassView from "@/components/Shared/GlassView";
import GradientBackground from "@/components/Shared/GradientBackground";
import { showToast } from "@/components/Shared/Toast";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { createOrder, fetchOrders } from "@/lib/store/slices/orderSlice";
import { fetchUser } from "@/lib/store/slices/userSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { View, StyleSheet, Text, Pressable } from "react-native";
export default function ProductPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((store) => store.cart.cart);
  const orders = useAppSelector((store) => store.orders.orders);
  const user = useAppSelector((store) => store.user);
  const session = useAppSelector((store) => store.session.session);
  const [loading, setLoading] = useState(false);
  const totalPrice = cart
    .map((product) => {
      const discount = product.discount ?? 0;
      const discountedPrice = product.price * (1 - discount / 100);
      return discountedPrice * product.quantity;
    })
    .reduce((a, b) => a + b, 0);
  useEffect(() => {
    const getUserAndOrders = async () => {
      setLoading(true);
      if (!session) return;
      await dispatch(fetchUser(session));
      if (orders.length === 0 || orders === null || !orders) {
        dispatch(fetchOrders());
      }
      setLoading(false);
    };

    getUserAndOrders();
  }, []);
  const create = async () => {
    setLoading(true);
    await dispatch(createOrder({ total: totalPrice, products: cart }));
    showToast({
      type: "success",
      title: "Заказ создан",
      description: "Заказ создан",
    });
    router.replace("/orders");
    setLoading(false);
  };
  return (
    <GradientBackground>
      <TitleHeader title={"Оформление заказа"} backButton={true} />
      <View style={styles.container}>
        <GlassView>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>Получатель</Text>
            <Text style={styles.info}>
              {user.full_name}, {user.phone}
            </Text>
          </View>
        </GlassView>
        <GlassView>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>Способ оплаты</Text>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <Text style={styles.info}>При получении</Text>
              <FontAwesome name={"money"} size={17} color="#fff" />
            </View>
          </View>
        </GlassView>
        <GlassView>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>Пункт выдачи</Text>
            <Text style={styles.info}>Ростов-на-Дону, пл. Гагарина, 1</Text>
          </View>
        </GlassView>
        <GlassView>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>Конечная стоимость</Text>

            <Text style={styles.info}>{totalPrice}</Text>
          </View>
        </GlassView>
        <Pressable
          style={({ pressed }) => [
            styles.orderButton,
            pressed && { opacity: 0.7 },
            loading && { opacity: 0.3 },
          ]}
          disabled={loading}
          onPress={create}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "regular",
            }}
          >
            {loading ? "Подождите.." : "Оформить заказ"}
          </Text>
        </Pressable>
      </View>
    </GradientBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 160,
    marginBottom: 110,
    gap: 20,
    marginHorizontal: 20,
  },
  itemContainer: {
    gap: 10,
    padding: 5,
  },
  items: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  title: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
  },
  info: {
    fontSize: 17,
    color: "#fff",
  },
  orderButton: {
    marginTop: 10,
    backgroundColor: "#191f28",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});
