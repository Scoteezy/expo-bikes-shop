import { ReactNode, useState } from "react";
import { StyleSheet, Pressable, Animated } from "react-native";
import { BlurView } from "expo-blur";

const GlassView = ({
  children,
  onClick,
  backgroundColor = "rgba(0, 0, 0, 0.2)",
}: {
  children: ReactNode;
  onClick?: () => void;
  backgroundColor?: string;
}) => {
  const [opacity] = useState(new Animated.Value(1)); // Начальное значение прозрачности

  const handlePressIn = () => {
    Animated.timing(opacity, {
      toValue: 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Pressable
      onPressIn={() => {
        handlePressIn();
        onClick && onClick();
      }}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.glassContainer, { opacity }]}>
        <BlurView
          intensity={70}
          tint="dark"
          style={[styles.glass, { backgroundColor }]}
        >
          {children}
        </BlurView>
      </Animated.View>
    </Pressable>
  );
};

export default GlassView;
const styles = StyleSheet.create({
  glassContainer: {
    borderRadius: 15, // Скругленные углы
    overflow: "hidden", // Обрезка для закругления углов
  },
  glass: {
    padding: 20, // Внутренний отступ
    shadowColor: "#000", // Тень
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)", // Полупрозрачная граница
    borderWidth: 1,
  },
});
