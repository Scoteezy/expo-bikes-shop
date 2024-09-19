import { View, StyleSheet, Image, Text } from "react-native";
import GlassView from "@/components/Shared/GlassView";
import { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/server/supabase";
import { LoadingOrError } from "../Shared/LoadingOrError";
import Category from "../Shared/Category";
import { FilterType } from "@/types";
import Price from "../Shared/Price";

const ShopItem = ({
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
    <View style={{ width: "48%" }}>
      <GlassView onClick={onClick}>
        {productImage ? (
          <Image
            source={{ uri: productImage }}
            style={styles.itemImage}
            resizeMode="contain"
          />
        ) : (
          <LoadingOrError error={error} style={styles.itemImage} />
        )}

        <View style={{ gap: 8 }}>
          <Category
            style={styles.itemSubText}
            name={product.category as FilterType}
          />
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
          {/* <Text style={styles.itemSubText}>{product.price} ₽</Text> */}
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
    color: "rgba(255, 255, 255,0.6)",
    fontSize: 15,
    fontWeight: "medium",
    opacity: 0.6,
  },
});
