import { StyleSheet, View, Text } from "react-native";

const TitleHeader = ({ title }: { title: string }) => {
  return (
    <View style={styles.multiHeaderContainer}>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  );
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
});
