import React, { useRef, useState } from "react";
import { PanResponder, StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";

const GlassView = ({
  children,
  onClick,
  backgroundColor = "rgba(0, 0, 0, 0.2)",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  backgroundColor?: string;
}) => {
  const [opacity] = useState(new Animated.Value(1)); // Начальное значение прозрачности
  const swipeThreshold = 10; // Порог для различения свайпа и клика
  const startX = useRef(0);
  const startY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        startX.current = e.nativeEvent.pageX;
        startY.current = e.nativeEvent.pageY;
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: (e) => {
        const deltaX = Math.abs(e.nativeEvent.pageX - startX.current);
        const deltaY = Math.abs(e.nativeEvent.pageY - startY.current);

        if (deltaX < swipeThreshold && deltaY < swipeThreshold) {
          onClick && onClick(); // Считаем за клик
        }

        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.glassContainer, { opacity }]}
    >
      <BlurView
        intensity={70}
        tint="dark"
        style={[styles.glass, { backgroundColor }]}
      >
        {children}
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glassContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  glass: {
    padding: 10,
    borderRadius: 10,
  },
});

export default GlassView;
