import { calculatePrice } from "@/utils";
import React from "react";
import { View, Text } from "react-native";

const Price = ({
  discount,
  price,
  styles,
  inline,
}: {
  discount?: number;
  inline?: boolean;
  price: number;
  styles: { color: string; fontSize: number; secondFontSize: number };
}) => {
  return discount ? (
    <View
      style={[
        {
          gap: 5,
        },
        inline && { flexDirection: "row", alignItems: "flex-end" },
      ]}
    >
      <Text style={{ color: styles.color, fontSize: styles.fontSize }}>
        {calculatePrice(price, discount)} ₽
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={[
            {
              color: styles.color,
              textDecorationLine: "line-through",
              fontSize: styles.secondFontSize,
              opacity: 0.7,
            },
          ]}
        >
          {price} ₽{" "}
        </Text>
        <Text
          style={[
            {
              color: styles.color,
              fontSize: styles.secondFontSize,
              opacity: 0.7,
            },
          ]}
        >
          - {discount}%
        </Text>
      </View>
    </View>
  ) : (
    <Text style={{ color: styles.color, fontSize: styles.fontSize }}>
      {price} ₽
    </Text>
  );
};

export default Price;
