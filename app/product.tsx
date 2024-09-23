import { ProductHeader } from "@/components/Header/ProductHeader";
import Category from "@/components/Shared/Category";
import GradientBackground from "@/components/Shared/GradientBackground";
import GradientButton from "@/components/Shared/GradientButton";
import { LoadingOrError } from "@/components/Shared/LoadingOrError";
import Price from "@/components/Shared/Price";
import { defaultStyles } from "@/constants/Style";
import {
  checkFavorite,
  makeFavorite,
  removeFavorite,
} from "@/lib/server/queries/favorite";
import { supabase } from "@/lib/server/supabase";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchFavorite,
  makeFavoriteSync,
  removeFavoriteSync,
} from "@/lib/store/slices/favoriteSlice";
import { FilterType } from "@/types";
import { Product } from "@/types/Product";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { View, Image, StyleSheet, Text } from "react-native";
export default function ProductPage() {
  const [productImage, setProductImage] = useState("");
  const [isFavorite, setIsFavorite] = useState<boolean | undefined>();
  const [isInCart, setIsInCart] = useState(true);
  const params = useLocalSearchParams();
  const { id } = params;
  const products = useAppSelector((store) => store.products.products);
  const session = useAppSelector((store) => store.session.session);
  const product: Product | undefined = useMemo(() => {
    return products.find((obj) => obj.id == id);
  }, [id]);
  const { favorite } = useAppSelector((store) => store.favorite);
  const dispatch = useAppDispatch();
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
    async function checkFav() {
      if (!session) {
        return;
      }
      if (favorite.length === 0 || favorite === null || !favorite) {
        console.log("dispatch");
        await dispatch(fetchFavorite(session));
      }
      const isFav = !!favorite.find((prod) => prod.id === id);
      // const isFav = await checkFavorite(session, id as string);
      setIsFavorite(isFav);
    }
    checkFav();
    product && downloadImage(product.image);
  }, [product]);
  const makeFav = async () => {
    if (!session) {
      return;
    }

    const error = await makeFavorite(session, id as string);
    if (error) {
      console.log("Error making favorite: ", error.message);
    }
    product && dispatch(makeFavoriteSync(product));
    setIsFavorite(true);
  };
  const removeFav = async () => {
    if (!session) {
      return;
    }
    const error = await removeFavorite(session, id as string);
    if (error) {
      console.log("Error removing favorite: ", error.message);
    }
    product && dispatch(removeFavoriteSync(product.id));
    setIsFavorite(false);
  };
  if (!product) {
    return null;
  }
  return (
    <GradientBackground>
      <ProductHeader
        title={product.name}
        isLiked={isFavorite}
        makeFav={makeFav}
        removeFav={removeFav}
      />
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
              onPress={
                isInCart
                  ? () => router.navigate("/cart")
                  : () => console.log("add to cart")
              }
              buttonStyles={{ width: 170, height: 44 }}
            >
              <Text
                style={{ fontSize: 15, color: "#fff", fontWeight: "medium" }}
              >
                {isInCart ? "Перейти в корзину" : "Добавить в корзину"}
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
  minusButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#353F54",
    width: 24,
    height: 24,
    borderRadius: 5,
  },
});
