import GradientButton from "@/components/Shared/GradientButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input } from "@rneui/themed";
export function ShopHeader({
  title,
  search,
  setSearch,
}: Readonly<{
  title: string;
  search: string;
  setSearch: (str: string) => void;
}>) {
  return (
    <View style={styles.headerContainer}>
      <Input
        placeholder={title}
        inputStyle={styles.inputStyles}
        value={search}
        onChangeText={setSearch}
        containerStyle={{
          width: "80%",
          padding: 0,
          margin: 0,
          paddingHorizontal: 0,
        }}
        inputContainerStyle={{
          borderBottomWidth: 0,
        }}
        errorStyle={{ display: "none" }}
      />
      <GradientButton
        onPress={() => {
          console.log("search");
        }}
        buttonStyles={{ width: 50 }}
        disabled
      >
        <FontAwesome name="search" size={24} color="#fff" />
      </GradientButton>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    height: 70,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#242C3B", // Фон хедера
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1, // Занимает оставшееся пространство
    alignItems: "center", // Центрирует текст по горизонтали
  },
  inputStyles: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    borderWidth: 0,
  },
});
