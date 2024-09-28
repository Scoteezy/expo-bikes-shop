import CartItem from "@/components/Cart/CartItem";
import TitleHeader from "@/components/Header/TitleHeader";
import GradientBackground from "@/components/Shared/GradientBackground";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCart } from "@/lib/store/slices/cartSlice";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const CartPage = () => {
  const { cart, status } = useAppSelector((store) => store.cart);
  const { session } = useAppSelector((store) => store.session);
  const totalPrice = cart
    .map((product) => {
      const discount = product.discount ?? 0;
      const discountedPrice = product.price * (1 - discount / 100);
      return discountedPrice * product.quantity;
    })
    .reduce((a, b) => a + b, 0);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetch = async () => {
      if (!session) {
        return;
      }
      await dispatch(fetchCart(session));
      console.log(cart);
    };
    fetch();
  }, []);
  if (status !== "fulfilled") {
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
      <TitleHeader title="Корзина" backButton={false} />

      <View style={styles.container}>
        <ScrollView style={{ maxHeight: 450 }}>
          <View style={styles.items}>
            {cart.map((product) => (
              <CartItem
                key={product.id}
                product={product}
                session={session}
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
      <View style={styles.orderButtonContainer}>
        <Pressable
          onPress={() => router.push({ pathname: "/order" })}
          style={({ pressed }) => [
            styles.orderButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "regular" }}>
            К оформлению
          </Text>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "regular" }}>
            {totalPrice} ₽
          </Text>
        </Pressable>
      </View>
    </GradientBackground>
  );
};

export default CartPage;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 160,
    marginBottom: 110,
    gap: 20,
    marginHorizontal: 20,
  },
  orderButtonContainer: {
    position: "absolute",
    bottom: 70,
    left: 10,
    right: 10,
    elevation: 0,
    backgroundColor: "#242C3B",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    height: 106,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopWidth: 0,
    alignItems: "center",
  },
  orderButton: {
    width: "90%",
    marginTop: 10,
    backgroundColor: "#191f28",
    height: 50,
    borderRadius: 14,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  items: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
});
