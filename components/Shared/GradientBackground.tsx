import { View, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
const { width, height } = Dimensions.get("window");

const GradientBackground = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <View style={styles.leftGradient} />
      <LinearGradient
        colors={["#37B6E9", "#4B4CED"]}
        end={{ x: 0.1, y: 0.55 }}
        style={styles.rightGradient}
      />
      {children}
    </>
  );
};
const styles = StyleSheet.create({
  leftGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "#1A1D25",
  },
  rightGradient: {
    position: "absolute",
    top: 0,
    right: -120,
    width: width - 50,
    height: height + 200,
    transform: [{ rotate: "20deg" }],
  },
});

export default GradientBackground;
