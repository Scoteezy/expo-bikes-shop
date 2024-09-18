import { View, StyleSheet, Image, Text } from "react-native";
import GlassView from "@/components/GlassView";

const ShopItem = () => {
  return (
    <View style={{ width: "48%" }}>
      <GlassView>
        <Image
          source={require("@/assets/images/bike-1.png")}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={{ gap: 8 }}>
          <Text style={styles.itemSubText}>Велосипед</Text>
          <Text numberOfLines={1} style={styles.text}>
            Peuheot -LR01
          </Text>
          <Text style={styles.itemSubText}>20000 ₽</Text>
        </View>
      </GlassView>
    </View>
  );
};

export default ShopItem;
const styles = StyleSheet.create({
  text: {
    color: "#fff", // Белый цвет текста
    fontSize: 17,
    fontWeight: "bold",
  },
  itemImage: {
    width: "100%",
    height: 100,
    marginBottom: 15,
  },
  itemSubText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "medium",
    opacity: 0.6,
  },
});
