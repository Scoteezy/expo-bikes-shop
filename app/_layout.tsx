import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/server/supabase";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
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
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        router.replace("/(tabs)");
      } else {
        console.log("no user");
      }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.replace("/(tabs)");
      } else {
        console.log("no user");
        router.replace("/(auth)/login");
      }
    });
  }, []);
  return (
    <Provider store={store}>
      <Stack>
        {session?.user ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
        <Stack.Screen
          name="product"
          options={{ title: "Об отеле", headerBackTitle: "Назад" }}
        />
      </Stack>
    </Provider>
  );
}
