import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import DiscountItem from "./DiscountItem";
import { Product } from "@/types/Product";

const width = Dimensions.get("window").width;

const DiscountSlider = ({
  discountProducts,
}: {
  discountProducts: Product[];
}) => {
  return (
    <View style={styles.sliderContainer}>
      <Carousel
        width={width - 40} // Задаем ширину слайдера
        height={230} // Задаем высоту слайдера
        data={discountProducts}
        loop={discountProducts.length > 1}
        autoPlay={discountProducts.length > 1}
        autoPlayInterval={10000}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => <DiscountItem discount={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginHorizontal: 20,
  },
  itemContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DiscountSlider;
