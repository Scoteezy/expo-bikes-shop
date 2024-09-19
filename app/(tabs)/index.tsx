import { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, ActivityIndicator } from "react-native";
import GradientBackground from "@/components/GradientBackground";
import GlassView from "@/components/GlassView";
import { FilterType } from "@/types";
import FilterIcon from "@/components/FilterIcon";
import ShopItem from "@/components/ShopItem";
import { ScrollView } from "react-native-gesture-handler";
import { defaultStyles } from "@/constants/Style";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productSlice";
import DiscountSlider from "@/components/DiscountSlider";

export default function TabOneScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const filters: Array<FilterType> = ["all", "bicycles", "gear", "tools"];
  const dispatch = useAppDispatch();
  const { products, discountProduct, status } = useAppSelector(
    (store) => store.products
  );
  useEffect(() => {
    const getProducts = async () => {
      await dispatch(fetchProducts());
    };
    getProducts();
  }, []);
  if (status !== "fulfilled") {
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
      <View style={defaultStyles.container}>
        <View style={{ height: 230 }}>
          <DiscountSlider discountProducts={discountProduct || []} />
        </View>
        <View style={styles.filters}>
          {filters.map((filter) =>
            activeFilter === filter ? (
              <GlassView
                key={filter}
                onClick={() => setActiveFilter(filter)}
                backgroundColor="rgba(65, 138, 237, .6)"
              >
                <FilterIcon iconName={filter} color="rgba(255, 255, 255, 1)" />
              </GlassView>
            ) : (
              <GlassView key={filter} onClick={() => setActiveFilter(filter)}>
                <FilterIcon
                  iconName={filter}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </GlassView>
            )
          )}
        </View>
        <ScrollView>
          <View style={styles.items}>
            {products.map((product) => (
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
  items: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginHorizontal: 20,
  },
  filters: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 20,
  },
});
