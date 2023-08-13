import "react-native-url-polyfill/auto";

import { useState, useEffect } from "react";

import { supabase } from "./lib/supabase";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomePage from "./screens/HomePage";
import ManageScreen from "./components/ManageScreen";
import AddScreen from "./components/AddScreen";
import ProfileScreen from "./components/ProfileScreen";
import Auth from "./screens/Auth";

const Tab = createBottomTabNavigator();

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
    <NavigationContainer>
      {session ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            children={() => <HomePage session={session} />}
          />

          <Tab.Screen name="Manage" component={ManageScreen} />
          <Tab.Screen name="Add" component={AddScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <Auth />
      )}
    </NavigationContainer>
  );
}
