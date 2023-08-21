import "react-native-url-polyfill/auto";
import { Image } from "react-native-elements";
import { useState, useEffect } from "react";

import { supabase } from "./lib/supabase";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./screens/HomePage";
import ManageScreen from "./components/UpcomingPayments";
import AddScreen from "./components/AddScreen";
import UpcomingPayments from "./components/UpcomingPayments";
import Auth from "./screens/Auth";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function MainStack({ session }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Manage"
        component={ManageScreen}
        options={{ title: "Manage" }}
      />
    </Stack.Navigator>
  );
}
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
            }}
          />

          {/* <Tab.Screen name="Manage" component={ManageScreen} /> */}

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
            }}
          />
        </Tab.Navigator>
      ) : (
        <Auth />
      )}
    </NavigationContainer>
  );
}
