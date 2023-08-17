import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

import { StyleSheet, View, Alert, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
export default function HomePage({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    console.log(session.user.id); // Add this line to check session data
    getProfile();
    displaySubscription();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      if (!session?.user) {
        throw new Error("No user on the session!");
      }

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  const userId = session.user.id;
  async function displaySubscription() {
    try {
      setLoading(true);
      const { data: subscriptionData, error } = await supabase
        .from("subspace_app")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        throw error;
      }
      if (subscriptionData) {
        // Notice the change here
        setSubscriptions(subscriptionData); // Use subscriptionData instead of data
        console.log(subscriptionData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text>{session?.user?.email || "No user"}</Text>

      <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />

      <Button
        title="Go to Manage"
        onPress={() => navigation.navigate("Manage")}
      />

      {loading ? (
        <Text>Loading Subscriptions...</Text>
      ) : (
        <View>
          <Text>Subscriptions: </Text>
          {subscriptions.map((subscription) => (
            <View key={subscription.id}>
              <Text>Subscription Name: {subscription.name}</Text>
              <Text>Subscription Price: {subscription.price}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
