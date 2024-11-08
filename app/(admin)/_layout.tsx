import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppDispatch } from "@/lib/store/hooks";
import { supabase } from "@/lib/server/supabase";
import { fetchSession, updateSession } from "@/lib/store/slices/sessionSlice";

export default function TabLayout() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchSession());

    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(updateSession(session));
    });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Профиль",
            title: "Профиль",
          }}
        />
        <Drawer.Screen
          name="graphs" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Графики",
            title: "Графики",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
