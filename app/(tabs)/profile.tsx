import { View, StyleSheet, Text, Pressable, Alert } from "react-native";

import GradientBackground from "@/components/Shared/GradientBackground";
import { supabase } from "@/lib/server/supabase";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import { fetchUser, updateUser } from "@/lib/store/slices/userSlice";
import { Input } from "@rneui/themed";
import Avatar from "@/components/Profile/Avatar";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState({
    fullName: "",
    number: "",
    avatarUrl: "",
  });

  // const [session, setSession] = useState<Session | null>(null)
  const session = useAppSelector((store) => store.session.session);
  const user = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (session && !user.id) getProfile();
  }, [session]);
  useEffect(() => {
    setUserState({
      fullName: user.full_name,
      number: user.phone ? user.phone.toString() : "+7",
      avatarUrl: user.avatar_url,
    });
  }, [user]);
  function validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+7\d{10}$/;
    return phoneRegex.test(phone);
  }

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

  async function updateProfile({
    full_name,
    number,
    avatar_url,
  }: {
    full_name: string;
    number: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");
      if (!validatePhoneNumber(number.toString())) {
        Alert.alert(
          "Неверный формат номера телефона. Номер должен начинаться с +7 и содержать 10 цифр"
        );
        return; // Stop the process if validation fails
      }
      const updates = {
        id: session?.user.id,
        full_name,
        phone: number,
        avatar_url,
        updated_at: new Date(),
      };

      dispatch(updateUser({ updates, id: session.user.id }));
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={{ display: "flex" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Avatar
              size={150}
              url={userState.avatarUrl}
              onUpload={(url: string) => {
                setUserState({ ...userState, avatarUrl: url });
                updateProfile({
                  full_name: userState.fullName,
                  number: userState.number,
                  avatar_url: url,
                });
              }}
            />
            <View style={{ width: "50%" }}>
              {/* <GradientButton
                onPress={() =>
                  updateProfile({
                    full_name: fullName,
                    number,
                    avatar_url: avatarUrl,
                  })
                }
                buttonStyles={styles.acceptButton}
              >
                <Text style={styles.text}>
                  {loading ? "Подождите ..." : "Изменить"}
                </Text>
              </GradientButton> */}
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? "rgba(36, 44, 59, .6)"
                      : "rgba(36, 44, 59, 1)",
                  },
                  styles.acceptButton,
                ]}
                onPress={() =>
                  updateProfile({
                    full_name: userState.fullName,
                    number: userState.number,
                    avatar_url: userState.avatarUrl,
                  })
                }
              >
                <Text style={styles.text}>
                  {loading ? "Подождите ..." : "Сохранить"}
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? "rgba(36, 44, 59, .6)"
                      : "rgba(36, 44, 59, 1)",
                  },
                  styles.acceptButton,
                ]}
                onPress={() => supabase.auth.signOut()}
              >
                <Text style={styles.text}>Выйти</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <Input
              label="Почта"
              disabled
              value={session?.user?.email || ""}
              placeholderTextColor={"#e9e7e7"}
              labelStyle={styles.inputLabelStyle}
              inputStyle={styles.inputStyles}
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{
                borderBottomWidth: 0,
              }}
              errorStyle={{ display: "none" }}
            />
            <Input
              label="Полное имя"
              value={userState.fullName || ""}
              onChangeText={(text) =>
                setUserState({ ...userState, fullName: text })
              }
              placeholderTextColor={"#e9e7e7"}
              labelStyle={styles.inputLabelStyle}
              inputStyle={styles.inputStyles}
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{
                borderBottomWidth: 0,
              }}
              errorStyle={{ display: "none" }}
            />
            <Input
              textContentType="telephoneNumber"
              inputMode="tel"
              label="Телефон"
              value={userState.number}
              onChangeText={(text) =>
                setUserState({ ...userState, number: text })
              }
              placeholderTextColor={"#e9e7e7"}
              style={styles.text}
              labelStyle={styles.inputLabelStyle}
              inputStyle={styles.inputStyles}
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{
                borderBottomWidth: 0,
              }}
              errorStyle={{ display: "none" }}
            />
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    marginHorizontal: 20,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
  innerContainer: {
    marginTop: 20,
    gap: 20,
    display: "flex",
    flexDirection: "column",
  },
  inputContainerStyle: {
    width: "100%",
    paddingTop: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    backgroundColor: "rgba(36, 44, 59, 0.2)",
    borderColor: "#242c3b", // Фон хедера
    borderRadius: 40,
    height: 70,
  },
  inputLabelStyle: {
    color: "white",
    fontSize: 13,
    fontWeight: "300",
    opacity: 0.5,
  },
  inputStyles: {
    color: "#fff",
    fontSize: 24,
    borderWidth: 0,
    minHeight: "auto",
  },
  acceptButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    borderRadius: 15,
    height: 60,
    elevation: 3,
    marginBottom: 15,
    shadowColor: "#171717",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignSelf: "center",
  },
});
