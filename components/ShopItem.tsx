import { View, StyleSheet, Image, Text, ActivityIndicator } from "react-native";
import GlassView from "@/components/GlassView";
import { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/server/supabase";

const ShopItem = ({
  onClick,
  product,
}: {
  onClick: () => void;
  product: Product;
}) => {
  const [productImage, setProductImage] = useState("");

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
          console.log("Error downloading image: ", error.message);
        }
      }
    }
    downloadImage(product.image);
  }, []);
  return (
    <View style={{ width: "48%" }}>
      <GlassView onClick={onClick}>
        {productImage ? (
          <Image
            source={{ uri: productImage }}
            style={styles.itemImage}
            resizeMode="contain"
          />
        ) : (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={styles.itemImage}
          />
        )}

        <View style={{ gap: 8 }}>
          <Text style={styles.itemSubText}>{product.category}</Text>
          <Text numberOfLines={1} style={styles.text}>
            {product.name}
          </Text>
          <Text style={styles.itemSubText}>{product.price} ₽</Text>
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
