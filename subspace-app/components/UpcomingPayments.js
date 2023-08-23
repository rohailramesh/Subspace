import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import SubscriptionCard from "./SubscriptionCard";
import { IconButton } from "react-native-paper";
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

  async function deleteSubscription(id) {
    try {
      setLoading(true);

      const { error } = await supabase.from("subspace").delete().eq("id", id);
      console.log("deleted");
      if (error) {
        throw error;
      }

      // Fetch updated subscriptions
      fetchUserSubscriptions();
    } catch (error) {
      console.error("Error deleting subscription:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/homepage-bg.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* <Text>{session?.user?.email || "No user"}</Text> */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              Upcoming Subscription Payments
            </Text>
            <IconButton
              icon="logout" // Replace with the name of your PNG image (without the file extension)
              onPress={() => supabase.auth.signOut()}
            />
          </View>
          <View>
            {upcomingSubscriptions.map((subscription, index) => (
              <View key={index} style={styles.subscriptionItem}>
                <SubscriptionCard
                  subscription={subscription}
                  onDelete={() => deleteSubscription(subscription.id)}
                />
                {/* Display other subscription details */}
              </View>
            ))}
          </View>

          {/* <Button title="Sign Out" onPress={() => supabase.auth.signOut()} /> */}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  backgroundImage: {
    flex: 1, // Take up the entire screen
    resizeMode: "cover", // Adjust the image size to cover the entire container
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
    marginTop: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
