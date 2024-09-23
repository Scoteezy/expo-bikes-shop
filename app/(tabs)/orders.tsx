import { View, StyleSheet, Text, ScrollView } from "react-native";

import GradientBackground from "@/components/Shared/GradientBackground";
import TitleHeader from "@/components/Header/TitleHeader";
import { defaultStyles } from "@/constants/Style";
import CartItem from "@/components/Cart/CartItem";
import { useAppSelector } from "@/lib/store/hooks";
import { router } from "expo-router";
import OrderItem from "@/components/Orders/OrderItem";

export default function MapPage() {
  const orders = useAppSelector((store) => store.products.products);
  return (
    <GradientBackground>
      <TitleHeader title="Заказы" />

      <View style={[defaultStyles.container, { marginHorizontal: 20 }]}>
        <ScrollView style={{ maxHeight: 800 }}>
          <View style={styles.items}>
            {orders.map((product) => (
              <OrderItem
                key={product.id}
                product={product}
                onClick={() =>
                  router.push({
                    pathname: "/product",
                    params: { id: product.id },
                  })
                }
              />
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
