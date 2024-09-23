import { View, StyleSheet, Image, Text, Pressable } from "react-native";
import GlassView from "@/components/Shared/GlassView";
import { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/server/supabase";
import { LoadingOrError } from "../Shared/LoadingOrError";
import Price from "../Shared/Price";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const CartItem = ({
  onClick,
  product,
}: {
  onClick: () => void;
  product: Product;
}) => {
  const [productImage, setProductImage] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    async function downloadImage(path: string) {
      const cleanedPath = path.replace(/[^\w.-]/g, "");
      try {
        const { data, error } = await supabase.storage
          .from("products")
          .download(cleanedPath);
        if (error) {
          throw error;
        }

        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setProductImage(fr.result as string);
        };
      } catch (error) {
        if (error instanceof Error) {
          setError(true);
          console.log("Error downloading image: ", error.message);
        }
      }
    }
    downloadImage(product.image);
  }, []);
  return (
    <View style={{ width: "100%" }}>
      <GlassView onClick={onClick}>
        <View
          style={{
            flexDirection: "row",
            gap: 15,
          }}
        >
          <View
            style={{
              width: 100,
              height: 90,
              backgroundColor: "rgba(54, 62, 81, 0.5)",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {productImage ? (
              <Image
                source={{ uri: productImage }}
                style={styles.itemImage}
                resizeMode="contain"
              />
            ) : (
              <LoadingOrError error={error} style={styles.itemImage} />
            )}
          </View>

          <View style={{ gap: 8, justifyContent: "space-between" }}>
            <Text numberOfLines={1} style={styles.text}>
              {product.name}
            </Text>
            <Price
              price={product.price}
              discount={product.discount}
              inline
              styles={{
                color: "rgba(255, 255, 255,0.6)",
                fontSize: 15,
                secondFontSize: 10,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              alignSelf: "flex-end",
            }}
          >
            <Pressable style={styles.minusButton}>
              <FontAwesome name="plus" size={14} color="#fff" />
            </Pressable>
            <Text
              style={{ color: "#fff", fontWeight: "semibold", fontSize: 15 }}
            >
              1
            </Text>
            <Pressable style={styles.minusButton}>
              <FontAwesome name="minus" size={14} color="#fff" opacity={0.6} />
            </Pressable>
          </View>
        </View>
      </GlassView>
    </View>
  );
};

export default CartItem;
const styles = StyleSheet.create({
  text: {
    color: "#fff", // Белый цвет текста
    fontSize: 17,
    fontWeight: "bold",
  },
  itemImage: {
    width: 85,
    height: 85,
  },
  itemSubText: {
    color: "rgba(255, 255, 255,0.6)",
    fontSize: 15,
    fontWeight: "medium",
    opacity: 0.6,
  },
  minusButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#353F54",
    width: 24,
    height: 24,
    borderRadius: 5,
  },
});
