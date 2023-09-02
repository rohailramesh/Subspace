import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import SubscriptionCard from "../components/SubscriptionCard";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";
import { IconButton, Card } from "react-native-paper";
export default function HomePage({ session }) {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
        .select(`id, email, name`) // Include the 'name' field
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      setName(data.name);
      // console.log(name);
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

      if (error) {
        throw error;
      }

      // Group subscriptions by name and select the one with the earliest next_billing_date
      const groupedSubscriptions = Object.values(
        data.reduce((acc, subscription) => {
          if (
            !acc[subscription.name] ||
            subscription.next_billing_date <
              acc[subscription.name].next_billing_date
          ) {
            acc[subscription.name] = subscription;
          }
          return acc;
        }, {})
      );

      setSubscriptions(groupedSubscriptions);
    } catch (error) {
      console.error("Error fetching user subscriptions:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubscription(id) {
    try {
      setLoading(true);

      // Get the subscription by ID to retrieve its name
      const { data: subscriptionData, error: subscriptionError } =
        await supabase.from("subspace").select(`name`).eq("id", id);

      if (subscriptionError) {
        throw subscriptionError;
      }

      const subscriptionName = subscriptionData[0].name;

      // Delete all subscriptions with the same name
      const { error } = await supabase
        .from("subspace")
        .delete()
        .eq("name", subscriptionName);

      if (error) {
        throw error;
      }

      // Fetch updated subscriptions
      Alert.alert("Success", "Subscriptions deleted successfully");
      fetchUserSubscriptions();
    } catch (error) {
      console.error("Error deleting subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredSubs = subscriptions.filter((sub) => {
    return sub.name.includes(searchQuery);
  });
  const subscriptionCount = subscriptions.length;

  return (
    <ImageBackground
      source={require("../assets/homepage-bg.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* <Text>{session?.user?.email || "No user"}</Text> */}
          <View style={styles.headerContainer}>
            {!name ? (
              <Text style={styles.headerText}>Subspace</Text>
            ) : (
              <Text style={styles.headerText}>{name}'s Subspace</Text>
            )}

            <IconButton
              icon="refresh" // Replace with the name of the refresh icon
              onPress={fetchUserSubscriptions} // Trigger the fetchUserSubscriptions function
            />
            <IconButton
              icon="location-exit" // Replace with the name of your PNG image (without the file extension)
              onPress={() => supabase.auth.signOut()}
            />
          </View>

          <View>
            {subscriptions.length === 0 ? (
              // Render the card for no subscriptions
              <Card style={styles.outlinedCard}>
                <Card.Content>
                  <Text variant="titleLarge">
                    No Subscription Found! Add a new subscription
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              // Render the subscriptions
              <View>
                <TextInput
                  // style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search Subscription By Name..."
                  placeholderTextColor="white"
                  style={styles.input}
                />

                {filteredSubs.map((sub) => (
                  <SubscriptionCard
                    key={sub.id}
                    subscription={sub}
                    onDelete={() => deleteSubscription(sub.id)}
                  />
                ))}
              </View>
              // <View>
              //   {subscriptions.map((subscription, index) => (
              //     <View key={index} style={styles.subscriptionItem}>
              //       <SubscriptionCard
              //         subscription={subscription}
              //         onDelete={() => deleteSubscription(subscription.id)}
              //       />
              //     </View>
              //   ))}
              // </View>
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
  outlinedCard: {
    padding: 5,
    backgroundColor: "white",
    borderWidth: 2,
    // borderColor: "black",
    borderRadius: 10,
    marginBottom: 10, // Add margin bottom to create a gap between cards
    // overflow: 'hidden', // You can keep or remove this line based on your design
  },
  input: {
    flex: 1,
    marginBottom: 5,
    borderWidth: 0.9,
    borderColor: "black",
    borderRadius: 8,
    padding: 8,
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
});

// import { useState, useEffect } from "react";
// import { supabase } from "../lib/supabase";
// import SubscriptionCard from "../components/SubscriptionCard";
// import {
//   StyleSheet,
//   View,
//   Alert,
//   Text,
//   TextInput,
//   ScrollView,
//   ImageBackground,
// } from "react-native";
// import { IconButton, Card } from "react-native-paper";
// export default function HomePage({ session }) {
//   const [loading, setLoading] = useState(true);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [name, setName] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     // console.log(session.user.id);
//     getProfile();
//     fetchUserSubscriptions();
//     const subscriptionChannel = supabase
//       .channel("custom-all-channel")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "subspace" },
//         (payload) => {
//           console.log("Change received!", payload);
//           fetchUserSubscriptions();
//         }
//       )
//       .subscribe();

//     return () => {
//       subscriptionChannel.unsubscribe();
//     };
//   }, [session]);

//   async function getProfile() {
//     try {
//       setLoading(true);

//       if (!session?.user) {
//         throw new Error("No user on the session!");
//       }

//       let { data, error, status } = await supabase
//         .from("profile")
//         .select(`id, email, name`) // Include the 'name' field
//         .eq("id", session.user.id)
//         .single();

//       if (error && status !== 406) {
//         throw error;
//       }
//       setName(data.name);
//       // console.log(name);
//     } catch (error) {
//       Alert.alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchUserSubscriptions() {
//     try {
//       setLoading(true);

//       const { data, error } = await supabase
//         .from("subspace")
//         .select(`*`)
//         .eq("user_id", session.user.id);
//       // console.log(data);

//       if (error) {
//         throw error;
//       }

//       setSubscriptions(data);
//     } catch (error) {
//       console.error("Error fetching user subscriptions:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function deleteSubscription(id) {
//     try {
//       setLoading(true);

//       const { error } = await supabase.from("subspace").delete().eq("id", id);
//       console.log("deleted");
//       if (error) {
//         throw error;
//       }

//       // Fetch updated subscriptions
//       Alert.alert("Success", "Subscription delete successfully");
//       fetchUserSubscriptions();
//     } catch (error) {
//       console.error("Error deleting subscription:", error);
//     } finally {
//       setLoading(false);
//     }
//   }
//   const filteredSubs = subscriptions.filter((sub) => {
//     return sub.name.includes(searchQuery);
//   });
//   const subscriptionCount = subscriptions.length;

//   return (
//     <ImageBackground
//       source={require("../assets/homepage-bg.jpg")}
//       style={styles.backgroundImage}
//     >
//       <View style={styles.container}>
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           {/* <Text>{session?.user?.email || "No user"}</Text> */}
//           <View style={styles.headerContainer}>
//             {!name ? (
//               <Text style={styles.headerText}>Subspace</Text>
//             ) : (
//               <Text style={styles.headerText}>{name}'s Subspace</Text>
//             )}

//             <IconButton
//               icon="refresh" // Replace with the name of the refresh icon
//               onPress={fetchUserSubscriptions} // Trigger the fetchUserSubscriptions function
//             />
//             <IconButton
//               icon="location-exit" // Replace with the name of your PNG image (without the file extension)
//               onPress={() => supabase.auth.signOut()}
//             />
//           </View>

//           <View>
//             {subscriptions.length === 0 ? (
//               // Render the card for no subscriptions
//               <Card style={styles.outlinedCard}>
//                 <Card.Content>
//                   <Text variant="titleLarge">
//                     No Subscription Found! Add a new subscription
//                   </Text>
//                 </Card.Content>
//               </Card>
//             ) : (
//               // Render the subscriptions
//               <View>
//                 <TextInput
//                   // style={styles.searchInput}
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                   placeholder="Search Subscription By Name..."
//                   placeholderTextColor="white"
//                   style={styles.input}
//                 />

//                 {filteredSubs.map((sub) => (
//                   <SubscriptionCard
//                     key={sub.id}
//                     subscription={sub}
//                     onDelete={() => deleteSubscription(sub.id)}
//                   />
//                 ))}
//               </View>
//               // <View>
//               //   {subscriptions.map((subscription, index) => (
//               //     <View key={index} style={styles.subscriptionItem}>
//               //       <SubscriptionCard
//               //         subscription={subscription}
//               //         onDelete={() => deleteSubscription(subscription.id)}
//               //       />
//               //     </View>
//               //   ))}
//               // </View>
//             )}
//           </View>
//         </ScrollView>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 40,
//     padding: 12,
//   },
//   backgroundImage: {
//     flex: 1, // Take up the entire screen
//     resizeMode: "cover", // Adjust the image size to cover the entire container
//   },
//   verticallySpaced: {
//     paddingTop: 4,
//     paddingBottom: 4,
//     alignSelf: "stretch",
//   },
//   mt20: {
//     marginTop: 20,
//   },
//   outlinedCard: {
//     padding: 5,
//     backgroundColor: "white",
//     borderWidth: 2,
//     // borderColor: "black",
//     borderRadius: 10,
//     marginBottom: 10, // Add margin bottom to create a gap between cards
//     // overflow: 'hidden', // You can keep or remove this line based on your design
//   },
//   input: {
//     flex: 1,
//     marginBottom: 5,
//     borderWidth: 0.9,
//     borderColor: "black",
//     borderRadius: 8,
//     padding: 8,
//   },
//   headerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginTop: 10,
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
// });
