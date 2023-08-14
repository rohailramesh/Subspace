import "react-native-url-polyfill/auto";
import { Image } from "react-native-elements";
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
            name="Subscriptions"
            children={() => <HomePage session={session} />}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("./assets/icons/subscription-model.png")}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "#007AFF" : "#8E8E93",
                  }}
                />
              ),
            }}
          />

          {/* <Tab.Screen name="Manage" component={ManageScreen} /> */}

          <Tab.Screen
            name="Add"
            // component={AddScreen}
            children={() => <AddScreen session={session} />}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("./assets/icons/add.png")}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "#007AFF" : "#8E8E93",
                  }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("./assets/icons/user.png")}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "#007AFF" : "#8E8E93",
                  }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Auth />
      )}
    </NavigationContainer>
  );
}
