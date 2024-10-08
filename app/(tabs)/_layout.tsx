import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { supabase } from "@/lib/server/supabase";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchSession, updateSession } from "@/lib/store/slices/sessionSlice";
function TabBarIcon(
  props: Readonly<{
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
    focused: boolean;
  }>
) {
  return (
    <View style={styles.iconContainer}>
      {props.focused ? (
        <LinearGradient
          colors={["#34C8E8", "#4E4AF2"]}
          style={styles.activeTabIcon}
        >
          <FontAwesome name={props.name} size={28} color="#fff" />
        </LinearGradient>
      ) : (
        <FontAwesome name={props.name} size={28} color={props.color} />
      )}
    </View>
  );
}

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
      <Tabs
        screenOptions={{
          headerShadowVisible: false,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 25,
            left: 10,
            right: 10,
            elevation: 0,
            backgroundColor: "#242C3B",
            borderRadius: 25,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            shadowRadius: 0,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#A1A1A1",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Choose Your Bike",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="bicycle" color={color} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name="shopping-cart"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="favorite"
          options={{
            title: "favorite",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="heart" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "My Orders",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="file-text" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="user" color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gradientButton: {
    borderRadius: 8,
    padding: 10,
    display: "flex",
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabIcon: {
    borderRadius: 12,
    width: 55,
    height: 55,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(77, 76, 242, 0.3)",
  },
});
