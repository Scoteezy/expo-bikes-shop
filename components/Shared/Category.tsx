import { FilterType } from "@/types";
import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
const Category = ({
  name,
  style,
}: {
  name: FilterType;
  style: StyleProp<TextStyle>;
}) => {
  switch (name) {
    case "bicycles":
      return <Text style={style}>Велосипед</Text>;
    case "gear":
      return <Text style={style}>Снаряжение</Text>;
    case "tools":
      return <Text style={style}>Инструменты</Text>;
  }
};

export default Category;
