import { View, StyleSheet, ScrollView } from "react-native";

import GradientBackground from "@/components/Shared/GradientBackground";
import TitleHeader from "@/components/Header/TitleHeader";
import { defaultStyles } from "@/constants/Style";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { router } from "expo-router";
import OrderItem from "@/components/Orders/OrderItem";
import { useEffect } from "react";
import { fetchOrders } from "@/lib/store/slices/orderSlice";

export default function MapPage() {
  const { orders } = useAppSelector((store) => store.orders);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getOrders = async () => {
      if (orders.length === 0 || orders === null || !orders) {
        dispatch(fetchOrders());
      }
    };
    getOrders();
  }, []);
  return (
    <GradientBackground>
      <TitleHeader title="Заказы" backButton={false} />

      <View style={[defaultStyles.container, { marginHorizontal: 20 }]}>
        <ScrollView style={{ maxHeight: 800 }}>
          <View style={styles.items}>
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  items: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
});
