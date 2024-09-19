import { ActivityIndicator, Image, ImageStyle, StyleProp } from "react-native";

export const LoadingOrError = ({
  error,
  style,
}: {
  error: boolean;
  style: StyleProp<ImageStyle>;
}) => {
  return error ? (
    <Image
      source={require("@/assets/images/404.webp")}
      style={style}
      resizeMode="contain"
    />
  ) : (
    <ActivityIndicator size="large" color="#fff" style={style} />
  );
};
