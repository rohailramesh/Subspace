import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { View, Text, ScrollView } from "react-native";

export default function UpcomingPayments({ session }) {
  const [loading, setLoading] = useState(true);
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState([]);

  useEffect(() => {
    fetchUpcomingSubscriptions();
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
