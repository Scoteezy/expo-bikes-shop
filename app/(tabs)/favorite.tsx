import { View, StyleSheet, ScrollView } from "react-native";

import GradientBackground from "@/components/Shared/GradientBackground";
import TitleHeader from "@/components/Header/TitleHeader";
import ShopItem from "@/components/Shop/ShopItem";
import { router } from "expo-router";
import { useAppSelector } from "@/lib/store/hooks";
import { defaultStyles } from "@/constants/Style";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { getUserFavorite } from "@/lib/server/queries/favorite";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<Product[] | null>([]);
  const { session } = useAppSelector((store) => store.session);

  useEffect(() => {
    const fetchFav = async () => {
      if (!session) {
        return;
      }
      const fav = await getUserFavorite(session);
      setFavorites(fav);
    };
    fetchFav();
  }, []);
  return (
    <GradientBackground>
      <TitleHeader title="Избранное" />
      <View style={defaultStyles.container}>
        <ScrollView>
          <View style={styles.items}>
            {favorites?.map((product) => (
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
            ))}
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
    marginHorizontal: 20,
  },
});
