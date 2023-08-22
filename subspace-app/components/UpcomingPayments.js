import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
export default function UpcomingPayments({ session }) {
  const [loading, setLoading] = useState(true);
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    fetchUpcomingSubscriptions();
    const subscriptionChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subspace" },
        (payload) => {
          console.log("Change received!", payload);
          fetchUpcomingSubscriptions();
        }
      )
      .subscribe();

    return () => {
      subscriptionChannel.unsubscribe();
    };
  }, [session]);

  async function fetchUpcomingSubscriptions() {
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

      // Filter subscriptions with next_billing_date onwards from today
      const filteredSubscriptions = data.filter(
        (subscription) => new Date(subscription.next_billing_date) >= new Date()
      );
      console.log(filteredSubscriptions);
      setUpcomingSubscriptions(filteredSubscriptions);
    } catch (error) {
      console.error("Error fetching upcoming subscriptions:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "left", justifyContent: "left" }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>User Subscriptions</Text>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* <Text>Upcoming Payments Screen</Text> */}
        {/* Display upcomingSubscriptions */}
        {upcomingSubscriptions.map((subscription, index) => (
          <View key={index}>
            <Text>Name: {subscription.name}</Text>
            <Text>Price: {subscription.price}</Text>
            <Text>Next Billing Date: {subscription.next_billing_date}</Text>
            {/* Display other subscription details */}
          </View>
        ))}
      </ScrollView>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 50,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
