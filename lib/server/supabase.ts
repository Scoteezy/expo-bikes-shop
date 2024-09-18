import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as Application from "expo-application";

const supabaseUrl = process.env["EXPO_PUBLIC_APP_SUPABASE_URL"];
const supabaseAnonKey = process.env["EXPO_PUBLIC_APP_SUPABASE_ANON_KEY"];
console.log(supabaseUrl);

const bundleId = Application.applicationId;
console.log("Bundle ID:", bundleId);

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
