import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

import { StyleSheet, View, Alert, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import UpcomingPayments from "../components/UpcomingPayments";
export default function HomePage({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  // const [website, setWebsite] = useState("");
  // const [avatarUrl, setAvatarUrl] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  useEffect(() => {
    // console.log(session.user.id);
    getProfile();
    fetchUserSubscriptions();
    const subscriptionChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subspace" },
        (payload) => {
          console.log("Change received!", payload);
          fetchUserSubscriptions();
        }
      )
      .subscribe();

    return () => {
      subscriptionChannel.unsubscribe();
    };
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      if (!session?.user) {
        throw new Error("No user on the session!");
      }

      let { data, error, status } = await supabase
        .from("profile")
        .select(`id, email`)
        .eq("id", session.user.id)
        .single();

      // console.log(data);
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        // setUsername(data.username);
        // console.log(data);
        // setWebsite(data.website);
        // setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserSubscriptions() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("subspace")
        .select(`*`)
        .eq("user_id", session.user.id);
      console.log(data);

      if (error) {
        throw error;
      }

      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching user subscriptions:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text>{session?.user?.email || "No user"}</Text>
      <Text style={{ marginTop: 20 }}>User Subscriptions:</Text>
      <View>
        {subscriptions.map((subscription, index) => (
          <View key={index} style={styles.subscriptionItem}>
            <Text>Name: {subscription.name}</Text>
            <Text>Price: {subscription.price}</Text>
            <Text>Start Date: {subscription.start_date}</Text>
            <Text>End Date: {subscription.end_date}</Text>
            <Text>Next Billing Date: {subscription.next_billing_date}</Text>
            <Text>Category: {subscription.category}</Text>
            <Text>Type: {subscription.type}</Text>
            <Text>Billing Period: {subscription.billing_period}</Text>
            <Text>Notes: {subscription.notes}</Text>
            <Text>Status: {subscription.status}</Text>
            <Text></Text>
            {/* Display other subscription details */}
          </View>
        ))}
      </View>

      <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
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
