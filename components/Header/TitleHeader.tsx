import { StyleSheet, View, Text } from "react-native";
import GradientButton from "../Shared/GradientButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";

const TitleHeader = ({
  title,
  backButton,
}: {
  title: string;
  backButton: boolean;
}) => {
  if (backButton) {
    return (
      <View style={styles.multiHeaderContainer}>
        <GradientButton
          onPress={() => router.back()}
          buttonStyles={{ width: 50 }}
        >
          <FontAwesome name="chevron-left" size={22} color="#fff" />
        </GradientButton>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.multiHeaderContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
    );
  }
};

export default TitleHeader;
const styles = StyleSheet.create({
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
    justifyContent: "center",
    backgroundColor: "#242C3B", // Фон хедера
    paddingHorizontal: 20,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 1, // Занимает оставшееся пространство
    alignItems: "center", // Центрирует текст по горизонтали
  },
});
