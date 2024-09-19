import GradientButton from "@/components/Shared/GradientButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input } from "@rneui/themed";
import { router } from "expo-router";
export function MainPageHeader({ title }: Readonly<{ title: string }>) {
  const [search, setSearch] = useState("");
  return (
    <View style={styles.headerContainer}>
      <Input
        placeholder={title}
        inputStyle={styles.inputStyles}
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
      >
        <FontAwesome name="search" size={24} color="#fff" />
      </GradientButton>
    </View>
  );
}
export function MultiHeader({ title }: Readonly<{ title: string }>) {
  return (
    <View style={styles.multiHeaderContainer}>
      <GradientButton
        onPress={() => router.back()}
        buttonStyles={{ width: 50 }}
      >
        <FontAwesome name="chevron-left" size={22} color="#fff" />
      </GradientButton>
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={styles.inputStyles}>
          {title}
        </Text>
      </View>
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
  multiHeaderContainer: {
    display: "flex",
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    height: 70,
    borderRadius: 25,
    flexDirection: "row",
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
