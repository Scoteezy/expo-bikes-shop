import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";

import GradientBackground from "@/components/Shared/GradientBackground";
import TitleHeader from "@/components/Header/TitleHeader";
import ShopItem from "@/components/Shop/ShopItem";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { defaultStyles } from "@/constants/Style";
import { useEffect } from "react";
import { fetchFavorite } from "@/lib/store/slices/favoriteSlice";
import { FontAwesome } from "@expo/vector-icons";
import GlassView from "@/components/Shared/GlassView";

export default function FavoritePage() {
  // const [favorites, setFavorites] = useState<Product[] | null>([]);
  const { session } = useAppSelector((store) => store.session);
  const { favorite, status } = useAppSelector((store) => store.favorite);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchFav = async () => {
      if (!session) {
        return;
      }
      if (favorite.length === 0 || favorite === null || !favorite) {
        dispatch(fetchFavorite(session));
      }
    };
    fetchFav();
  }, []);
  if (status == "idle") {
    return (
      <GradientBackground>
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </GradientBackground>
    );
  }
  return (
    <GradientBackground>
      <TitleHeader title="Избранное" backButton={false} />
      <View style={[defaultStyles.container, { marginHorizontal: 20 }]}>
        <ScrollView>
          <GlassView onClick={() => router.replace("/(tabs)")}>
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                gap: 15,
                padding: 10,
              }}
            >
              <FontAwesome
                name="heart"
                size={36}
                color="#fff"
                style={{ alignSelf: "center" }}
              />
              <View style={{ gap: 5, width: "85%" }}>
                <Text style={[styles.text, { fontSize: 18 }]}>
                  Добавьте товары своей мечты
                </Text>
                <Text style={[styles.text, { fontSize: 14 }]}>
                  Так вы их точно не потеряете — они будут в этом списке
                </Text>
              </View>
            </View>
          </GlassView>
          <View style={styles.items}>
            {favorite.length != 0 ? (
              favorite.map((product) => (
                <ShopItem
                  key={product.id}
                  product={product}
                  onClick={() =>
                    router.push({
                      pathname: "/product",
                      params: { id: product.id },
                    })
                  }
                />
              ))
            ) : (
              <View style={{ flex: 1 }}></View>
            )}
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  items: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 20,
  },
  text: {
    color: "#FFF",
  },
});
