import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ProductPage() {
  const params = useLocalSearchParams();
  const { id } = params; // Get the ID passed through the Link

  return (
    <View>
      <Text>Product ID: {id}</Text>
    </View>
  );
}
