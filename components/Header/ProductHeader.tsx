import GradientButton from "@/components/Shared/GradientButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Animated,
} from "react-native";
import { useRef } from "react";
import { router } from "expo-router";
export function ProductHeader({
  title,
  isLiked,
  makeFav,
  removeFav,
}: Readonly<{
  title: string;
  isLiked: boolean | undefined;
  removeFav: () => Promise<void>;
  makeFav: () => Promise<void>;
}>) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.6, // Уменьшение до 80%
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // Здесь можно сделать логику добавления или удаления из избранного
    if (isLiked) {
      removeFav();
    } else {
      makeFav();
    }
  };

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
      <View>
        {typeof isLiked === "undefined" ? (
          <ActivityIndicator size={24} />
        ) : (
          <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <FontAwesome
                name={isLiked ? "heart" : "heart-o"}
                size={22}
                color="#fff"
              />
            </Animated.View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

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
    backgroundColor: "#242C3B", // Фон хедера
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1, // Занимает оставшееся пространство
    alignItems: "center", // Центрирует текст по горизонтали
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
