import { MultiHeader } from "@/components/Headers";
import Category from "@/components/Shared/Category";
import GradientBackground from "@/components/Shared/GradientBackground";
import GradientButton from "@/components/Shared/GradientButton";
import { LoadingOrError } from "@/components/Shared/LoadingOrError";
import Price from "@/components/Shared/Price";
import { defaultStyles } from "@/constants/Style";
import { supabase } from "@/lib/server/supabase";
import { useAppSelector } from "@/lib/store/hooks";
import { FilterType } from "@/types";
import { Product } from "@/types/Product";
import { calculatePrice } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
export default function ProductPage() {
  const [productImage, setProductImage] = useState("");

  const params = useLocalSearchParams();
  const { id } = params; // Get the ID passed through the Link
  const products = useAppSelector((store) => store.products.products);
  const product: Product | undefined = useMemo(() => {
    return products.find((obj) => obj.id == id);
  }, [id]);
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
    product && downloadImage(product.image);
  }, [product]);

  if (!product) {
    return null;
  }
  return (
    <GradientBackground>
      <MultiHeader title={product.name} />
      <View style={defaultStyles.container}>
        {productImage ? (
          <Image
            source={{ uri: productImage, cache: "force-cache" }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <LoadingOrError error={false} style={styles.image} />
        )}
        <LinearGradient
          colors={["#353F54", "#222834"]}
          end={{ x: 0.5, y: 0.6 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardSpecs}>
            <View style={styles.cardSpecsItem}>
              <Category
                name={product.category as FilterType}
                style={styles.cardDescription}
              />
            </View>
            <View style={styles.cardSpecsItem}>
              <Text style={styles.cardDescription}>
                В наличии {product.in_stock} шт.
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{product.name}</Text>
            <Text style={styles.cardDescription}>{product.description}</Text>
          </View>

          <LinearGradient
            colors={["#262E3D", "#262E3D"]}
            end={{ x: 0.5, y: 0.6 }}
            style={styles.cardBuyGradient}
          >
            <Price
              price={product.price}
              discount={product.discount}
              styles={{ fontSize: 24, secondFontSize: 16, color: "#3D9CEA" }}
            />
            <GradientButton
              onPress={() => console.log("add to cart")}
              buttonStyles={{ width: 170, height: 44 }}
            >
              <Text
                style={{ fontSize: 15, color: "#fff", fontWeight: "medium" }}
              >
                Добавить в корзину
              </Text>
            </GradientButton>
          </LinearGradient>
        </LinearGradient>
      </View>
    </GradientBackground>
  );
}
const styles = StyleSheet.create({
  cardGradient: {
    height: 500,
    position: "relative",
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
  cardBuyGradient: {
    height: 110,
    flexDirection: "row",
    borderTopRightRadius: 50,
    paddingHorizontal: 22,
    borderTopLeftRadius: 50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    padding: 22,
  },
  cardSpecs: {
    marginTop: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 44,
  },
  cardSpecsItem: {
    backgroundColor: "#323B4F",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 140,
    shadowColor: "#171717",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderRadius: 10,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: "#fff",
    opacity: 0.6,
    fontWeight: "300",
  },
  image: {
    height: 208,
  },
});
