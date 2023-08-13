import "react-native-url-polyfill/auto";

import { useState, useEffect } from "react";

import { supabase } from "./lib/supabase";

import Auth from "./screens/Auth";

import HomePage from "./screens/Home";

import { View } from "react-native";

import { Session } from "@supabase/supabase-js";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <View>
        {session && session.user ? (
          <HomePage key={session.user.id} session={session} />
        ) : (
          <Auth />
        )}
      </View>
    </SafeAreaProvider>
  );
}
