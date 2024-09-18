import GradientButton from "@/components/GradientButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input } from "@rneui/themed";
function MainPageHeader({ title }: Readonly<{ title: string }>) {
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
  inputStyles: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    borderWidth: 0,
  },
});
export default MainPageHeader;
