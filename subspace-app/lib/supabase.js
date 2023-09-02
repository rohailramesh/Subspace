// import "react-native-url-polyfill/auto";
// import * as SecureStore from "expo-secure-store";
// import { createClient } from "@supabase/supabase-js";

// const ExpoSecureStoreAdapter = {
//   getItem: (key) => {
//     return SecureStore.getItemAsync(key);
//   },
//   setItem: (key, value) => {
//     SecureStore.setItemAsync(key, value);
//   },
//   removeItem: (key) => {
//     SecureStore.deleteItemAsync(key);
//   },
// };

// const supabaseUrl = "https://iuvfokhjduqlumrlutlh.supabase.co";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dmZva2hqZHVxbHVtcmx1dGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI1NDg0NzcsImV4cCI6MjAwODEyNDQ3N30.1nfFxw3kXFBmkcJrH38E2cQCksR96iBABK9XvBvRYZk";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: ExpoSecureStoreAdapter,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });
import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";
import * as Config from "subspace-app/config.js"; // Adjust the path to your config file

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

const supabaseUrl = Config.supabaseUrl;
const supabaseAnonKey = Config.supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
