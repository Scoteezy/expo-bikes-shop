import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import GlassView from "@/components/Shared/GlassView";
import { CartProduct } from "@/types/Product";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/server/supabase";
import { LoadingOrError } from "../Shared/LoadingOrError";
import Price from "../Shared/Price";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { showToast } from "../Shared/Toast";
import { addToCart, removeFromCart } from "@/lib/store/slices/cartSlice";
import { Session } from "@supabase/supabase-js";

const CartItem = ({
  onClick,
  product,
  session,
}: {
  onClick: () => void;
  product: CartProduct;
  session: Session | null;
}) => {
  const [productImage, setProductImage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const products = useAppSelector((store) => store.products.products);
  const productInStore = products.find((obj) => obj.id == product.id);
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
          setError(true);
          console.log("Error downloading image: ", error.message);
        }
      }
    }
    downloadImage(product.image);
  }, []);
  const addToCartFunc = async () => {
    setLoading(true);
    if (!productInStore || !session) {
      showToast({
        type: "error",
        title: "Товар закончился.",
        description: "Товара больше нет в наличии.",
      });
      return;
    }
    if (productInStore.in_stock >= product.quantity + 1) {
      await dispatch(addToCart({ session, productId: product.id }));
    } else {
      showToast({
        type: "error",
        title: "Товар закончился.",
        description: "Товара больше нет.",
      });
    }
    setLoading(false);
  };
  const removeFromCartFunc = async () => {
    setLoading(true);
    if (!productInStore || !session) {
      showToast({
        type: "error",
        title: "Товар закончился.",
        description: "Товара больше нет в наличии.",
      });
      return;
    }
    await dispatch(removeFromCart({ session, productId: product.id }));

    setLoading(false);
  };
  return (
    <View style={{ width: "100%", position: "relative" }}>
      <GlassView onClick={onClick}>
        {loading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              size="large"
              color="#fff"
              style={styles.itemImage}
            />
          </View>
        )}
        <View
          style={[
            {
              flexDirection: "row",
              gap: 15,
            },
            loading && [{ opacity: 0.4 }],
          ]}
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
            <Pressable
              style={({ pressed }) => [
                styles.minusButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={removeFromCartFunc}
              disabled={loading}
            >
              {product.quantity != 1 ? (
                <FontAwesome
                  name="minus"
                  size={14}
                  color="#fff"
                  opacity={loading ? 0.6 : 1}
                />
              ) : (
                <FontAwesome
                  name="trash"
                  size={14}
                  color="#fff"
                  opacity={loading ? 0.6 : 1}
                />
              )}
            </Pressable>

            <Text
              style={{ color: "#fff", fontWeight: "semibold", fontSize: 15 }}
            >
              {product.quantity}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.minusButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={addToCartFunc}
              disabled={loading}
            >
              <FontAwesome
                name="plus"
                size={14}
                color="#fff"
                opacity={loading ? 0.6 : 1}
              />
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
