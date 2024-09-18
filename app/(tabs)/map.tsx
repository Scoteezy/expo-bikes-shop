import { View, StyleSheet, Text } from "react-native";

import GradientBackground from "@/components/GradientBackground";

export default function MapPage() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text>Map</Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
