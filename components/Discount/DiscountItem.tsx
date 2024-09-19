import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import GlassView from "../Shared/GlassView";
import { Product } from "@/types/Product";
import { supabase } from "@/lib/server/supabase";
import { LoadingOrError } from "../Shared/LoadingOrError";

const DiscountItem = ({ discount }: { discount: Product }) => {
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
    downloadImage(discount.image);
  }, []);
  return (
    <GlassView
      onClick={() =>
        router.push({ pathname: "/product", params: { id: discount.id } })
      }
    >
      <View style={styles.discount}>
        {productImage ? (
          <Image
            source={{ uri: productImage }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <LoadingOrError error={error} style={styles.image} />
        )}
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            opacity: 0.6,
            color: "#fff",
          }}
        >
          {discount.discount}% Скидка
        </Text>
      </View>
    </GlassView>
  );
};

export default DiscountItem;
const styles = StyleSheet.create({
  items: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  discount: {
    display: "flex",
    gap: 5,
    flexDirection: "column",
  },
  filters: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  image: {
    width: "100%",
    height: 150,
  },
});
