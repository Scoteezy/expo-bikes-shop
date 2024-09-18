import React, { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import GradientBackground from "@/components/GradientBackground";
import GlassView from "@/components/GlassView";
import { FilterType } from "@/types";
import FilterIcon from "@/components/FilterIcon";
import ShopItem from "@/components/ShopItem";
import { ScrollView } from "react-native-gesture-handler";

export default function TabOneScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const filters: Array<FilterType> = ["all", "bicycles", "gear", "tools"];
  return (
    <GradientBackground>
      <View style={styles.container}>
        <GlassView>
          <View style={styles.discount}>
            <Image
              source={require("@/assets/images/discount.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 26, fontWeight: "bold", opacity: 0.6 }}>
              30% Скидка
            </Text>
          </View>
        </GlassView>
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
            <ShopItem />
            <ShopItem />
            <ShopItem />
            <ShopItem />
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 160,
    marginBottom: 110,
    marginHorizontal: 20,
    gap: 20,
  },
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
