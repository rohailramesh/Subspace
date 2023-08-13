import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = "https://uscqsjvwjimxwtjodgwv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY3FzanZ3amlteHd0am9kZ3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE4NDk3OTMsImV4cCI6MjAwNzQyNTc5M30.4Ss89JK3Khd8Y4LeRVl4nGMV7h_PCr4nS4wCTVompPU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
