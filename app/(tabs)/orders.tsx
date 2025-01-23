import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";

import GradientBackground from "@/components/Shared/GradientBackground";
import TitleHeader from "@/components/Header/TitleHeader";
import { defaultStyles } from "@/constants/Style";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import OrderItem from "@/components/Orders/OrderItem";
import { useEffect } from "react";
import { fetchOrders } from "@/lib/store/slices/orderSlice";
import GlassView from "@/components/Shared/GlassView";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function MapPage() {
  const { orders, status } = useAppSelector((store) => store.orders);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getOrders = async () => {
      if (orders.length === 0 || orders === null || !orders) {
        dispatch(fetchOrders());
      }
    };
    getOrders();
  }, []);
  if (status == "idle") {
    return (
      <GradientBackground>
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </GradientBackground>
    );
  }
  return (
    <GradientBackground>
      <TitleHeader title="Заказы" backButton={false} />

      <View style={[defaultStyles.container, { marginHorizontal: 20 }]}>
        {orders.length > 0 ? (
          <ScrollView>
            <View style={styles.items}>
              {orders.map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <GlassView onClick={() => router.replace("/(tabs)")}>
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                gap: 15,
                padding: 10,
              }}
            >
              <FontAwesome
                name="file-text"
                size={36}
                color="#fff"
                style={{ alignSelf: "center" }}
              />
              <View style={{ gap: 5, width: "85%" }}>
                <Text style={[styles.text, { fontSize: 18 }]}>
                  Тут вы сможете отслеживать ваши заказы
                </Text>
                <Text style={[styles.text, { fontSize: 14 }]}>
                  Пока что у вас нет активных заказов.
                </Text>
              </View>
            </View>
          </GlassView>
        )}
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
  text: {
    color: "#FFF",
  },
});
