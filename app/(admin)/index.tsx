import { useEffect, useState } from "react";
import { supabase } from "@/lib/server/supabase";
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchUser } from "@/lib/store/slices/userSlice";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const session = useAppSelector((store) => store.session.session);
  const { email, status } = useAppSelector((store) => store.user);
  useEffect(() => {
    if (session) getProfile();
  }, [session]);
  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");
      await dispatch(fetchUser(session));
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Вы вошли от имени администратора.</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text>Почта: {email}</Text>
      </View>
      <Pressable
        style={({ pressed }) => {
          return [styles.button, pressed && { opacity: 0.6 }];
        }}
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={{ color: "#fff", fontSize: 22 }}>Выйти</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 10,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    marginTop: 17,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
