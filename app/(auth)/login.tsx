import Auth from "@/components/Auth/Auth";
import { StyleSheet, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Auth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#95B9F3",
  },
});
