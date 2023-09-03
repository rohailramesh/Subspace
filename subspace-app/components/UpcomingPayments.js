import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SubscriptionCard from "./SubscriptionCard";
import { IconButton, Card, Button } from "react-native-paper";
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
        .select("*")
        .order("next_billing_date", { ascending: true })
        .eq("user_id", session.user.id);

      if (error) {
        throw error;
      }

      // Filter subscriptions with next_billing_date onwards from today
      const filteredSubscriptions = data.filter(
        (subscription) => new Date(subscription.next_billing_date) >= new Date()
      );
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
      if (error) {
        throw error;
      }

      Alert.alert(
        "Subscription delete successfully",
        "Please refresh home page"
      );
      // Fetch updated subscriptions
      fetchUpcomingSubscriptions();
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
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Upcoming Payments</Text>
            <IconButton
              icon="refresh" // Replace with the name of the refresh icon
              onPress={fetchUpcomingSubscriptions} // Trigger the fetchUserSubscriptions function
            />
            <IconButton
              icon="location-exit" // Replace with the name of your PNG image (without the file extension)
              onPress={() => supabase.auth.signOut()}
            />
          </View>
          <View>
            {upcomingSubscriptions.length === 0 ? (
              // Render the card for no subscriptions
              <Card style={styles.outlinedCard}>
                <Card.Content>
                  <Text variant="titleLarge">No Upcoming Payments</Text>
                </Card.Content>
              </Card>
            ) : (
              // Render the subscriptions
              <View>
                {upcomingSubscriptions.map((subscription, index) => (
                  <View key={index} style={styles.subscriptionItem}>
                    <Card style={styles.outlinedCard}>
                      <Card.Content>
                        <Text variant="titleLarge">
                          <Text style={styles.boldText}>Name: </Text>
                          {subscription.name}
                        </Text>
                        <Text variant="bodyMedium">
                          <Text style={styles.boldText}>
                            Upcoming payment of:
                          </Text>{" "}
                          £{subscription.price}
                        </Text>
                        <Text variant="bodyMedium">
                          <Text style={styles.boldText}>Billing Date:</Text>{" "}
                          {subscription.next_billing_date}
                        </Text>
                        <Button
                          mode="contained"
                          style={styles.button}
                          onPress={() => deleteSubscription(subscription.id)} // Call the deleteSubscription function here
                        >
                          Remove Payment
                        </Button>
                      </Card.Content>
                    </Card>
                  </View>
                ))}
              </View>
            )}
          </View>
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
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  outlinedCard: {
    padding: 5,
    backgroundColor: "white",
    borderWidth: 2,
    // borderColor: "black",
    borderRadius: 10,
    marginBottom: 10, // Add margin bottom to create a gap between cards
    // overflow: 'hidden', // You can keep or remove this line based on your design
  },
  boldText: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "black", // Customize button background color
    marginTop: 10,
  },
  buttonText: {
    color: "white", // Customize button text color
  },
});
