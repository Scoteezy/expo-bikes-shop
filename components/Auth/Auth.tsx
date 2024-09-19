import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState, Text } from "react-native";
import { supabase } from "@/lib/server/supabase";
import { Input } from "@rneui/themed";
import GradientBackground from "../Shared/GradientBackground";
import GradientButton from "../Shared/GradientButton";
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Проверьте вашу почту!");
    setLoading(false);
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email"
            labelStyle={{ color: "white" }}
            leftIcon={{
              type: "font-awesome",
              name: "envelope",
              color: "white",
            }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
            placeholderTextColor={"#e9e7e7"}
            style={styles.text}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Пароль"
            labelStyle={{ color: "white" }}
            leftIcon={{ type: "font-awesome", name: "lock", color: "white" }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Пароль"
            autoCapitalize={"none"}
            placeholderTextColor={"#e9e7e7"}
            style={styles.text}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <GradientButton
            onPress={() => signInWithEmail()}
            buttonStyles={styles.acceptButton}
          >
            <Text style={styles.text}>Войти</Text>
          </GradientButton>
          <GradientButton
            onPress={() => signUpWithEmail()}
            buttonStyles={styles.acceptButton}
          >
            <Text style={styles.text}>Зарегистрироваться</Text>
          </GradientButton>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    color: "white",
    shadowColor: "#171717",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 6,
  },
  acceptButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    borderRadius: 6,
    elevation: 3,
    marginBottom: 15,
    shadowColor: "#171717",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignSelf: "center",
  },
});
