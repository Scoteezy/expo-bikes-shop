import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/server/supabase";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { toastConfig } from "@/components/Shared/Toast";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "user" | "">("");
  useEffect(() => {
    // Получаем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.email ?? "");
      } else {
        console.log("no user");
        router.replace("/(auth)/login");
      }
    });

    // Обрабатываем изменения состояния авторизации
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchUserRole(session.user.email ?? "");
        } else {
          console.log("no user");
          router.replace("/(auth)/login");
        }
      }
    );

    // Очистка слушателя при размонтировании
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Функция для получения роли пользователя
  const fetchUserRole = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email)
        .single();

      if (error || !data) {
        console.log(error);
        setUserRole("user"); // Устанавливаем роль по умолчанию как "user"
        router.replace("/(tabs)");
        return;
      }

      const role = data.role;
      setUserRole(role);
      if (role === "admin") {
        router.replace("/(admin)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      setUserRole("user"); // Роль по умолчанию
      router.replace("/(tabs)");
    }
  };
  console.log(userRole);
  return (
    <>
      <Provider store={store}>
        <Stack>
          {session?.user ? (
            userRole === "admin" ? (
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            )
          ) : (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          )}
          <Stack.Screen
            name="product"
            options={{
              title: "О продукте",
              headerBackTitle: "Назад",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="order"
            options={{
              title: "Заказ",
              headerBackTitle: "Назад",
              headerShown: false,
            }}
          />
        </Stack>
      </Provider>
      <Toast config={toastConfig} />
    </>
  );
}
