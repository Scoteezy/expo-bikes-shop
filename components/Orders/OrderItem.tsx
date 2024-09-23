import { View, StyleSheet, Text } from "react-native";
import GlassView from "@/components/Shared/GlassView";
import { Product } from "@/types/Product";
import Category from "../Shared/Category";
import { FilterType } from "@/types";
import Price from "../Shared/Price";

const OrderItem = ({
  onClick,
  product,
}: {
  onClick: () => void;
  product: Product;
}) => {
  return (
    <View style={{ width: "100%" }}>
      <GlassView onClick={onClick}>
        <View style={{ gap: 8 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text numberOfLines={1} style={styles.text}>
              Заказ №123123
            </Text>
            <Text style={styles.itemSubText}>23.09.2024</Text>
          </View>
          <Text style={styles.itemSubText}> 3 Товара • 123123 ₽</Text>
        </View>
      </GlassView>
    </View>
  );
};

export default OrderItem;
const styles = StyleSheet.create({
  text: {
    color: "#fff", // Белый цвет текста
    fontSize: 17,
    fontWeight: "bold",
  },
  itemSubText: {
    color: "rgba(255, 255, 255,0.6)",
    fontSize: 17,
    opacity: 0.6,
  },
});
