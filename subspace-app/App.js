import "react-native-url-polyfill/auto";
import { Image } from "react-native-elements";
import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./screens/HomePage";
import Profile from "./components/Profile";
import AddScreen from "./components/AddScreen";
import UpcomingPayments from "./components/UpcomingPayments";
import Auth from "./screens/Auth";
import WelcomeScreen from "./components/WelcomeScreen";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => {
    const checkSession = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (session) {
        supabase.auth.signOut(); // Log out if a session is found
      }
    };

    checkSession();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setShowWelcome(true);
    });
  }, []);
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };
  return (
    <NavigationContainer>
      {session ? (
        <React.Fragment>
          {showWelcome ? (
            <WelcomeScreen
              session={session}
              onWelcomeComplete={handleWelcomeComplete}
            />
          ) : (
            // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Tab.Navigator>
              <Tab.Screen
                name="My Subscriptions"
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
                  tabBarLabel: "Subscriptions",
                  headerShown: false,
                }}
              />

              <Tab.Screen
                name="Add Subscription"
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
                  tabBarLabel: "Add",
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Upcoming Payments"
                children={() => <UpcomingPayments session={session} />}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <Image
                      source={require("./assets/icons/payment.png")}
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: focused ? "#007AFF" : "#8E8E93",
                      }}
                    />
                  ),
                  tabBarLabel: "Payments",
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="My Profile"
                children={() => <Profile session={session} />}
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
                  tabBarLabel: "Profile",
                  headerShown: false,
                }}
              />
            </Tab.Navigator>
          )}
        </React.Fragment>
      ) : (
        // </ScrollView>
        <Auth />
      )}
    </NavigationContainer>
  );
}
