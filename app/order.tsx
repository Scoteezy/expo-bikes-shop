import TitleHeader from "@/components/Header/TitleHeader";
import GlassView from "@/components/Shared/GlassView";
import GradientBackground from "@/components/Shared/GradientBackground";
import { useAppSelector } from "@/lib/store/hooks";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
export default function ProductPage() {
  const cart = useAppSelector((store) => store.cart.cart);
  const user = useAppSelector((store) => store.user);
  const totalPrice = cart
    .map((product) => {
      const discount = product.discount ?? 0;
      const discountedPrice = product.price * (1 - discount / 100);
      return discountedPrice * product.quantity;
    })
    .reduce((a, b) => a + b, 0);
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
          ]}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "regular",
            }}
          >
            Оформить заказ
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
