import { Stack } from "expo-router";
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1A1D25",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="login" options={{ title: "Авторизация" }} />
    </Stack>
  );
}
