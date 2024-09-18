import React, { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientButton({
  children,
  buttonStyles,
  onPress,
  disabled,
}: Readonly<{
  children: ReactNode;
  onPress: () => unknown;
  buttonStyles?: StyleProp<ViewStyle>;
  disabled?: boolean;
}>) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.headerButton,
        pressed && styles.pressed,
        buttonStyles,
        disabled && { opacity: 0.3 },
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <LinearGradient colors={["#34C8E8", "#4E4AF2"]} style={[styles.gradient]}>
        {children}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    borderRadius: 12,
    overflow: "hidden", // Чтобы градиент не выходил за границы
    height: 50,
  },
  gradient: {
    padding: 10, // Паддинг внутри кнопки для контента (иконки)
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Градиент на всю ширину кнопки
    height: "100%", // Градиент на всю высоту кнопки
  },
  pressed: {
    opacity: 0.7, // Тусклый эффект при нажатии
  },
});
