import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import SubscriptionCard from "../components/SubscriptionCard";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { IconButton } from "react-native-paper";
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
      // console.log(data);

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
            <Text style={styles.headerText}>All Subscriptions</Text>
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
            {subscriptions.map((subscription, index) => (
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
// import { useState, useEffect } from "react";
// import { supabase } from "../lib/supabase";
// import SubscriptionCard from "../components/SubscriptionCard";
// import {
//   StyleSheet,
//   View,
//   Alert,
//   Text,
//   ScrollView,
//   ImageBackground,
// } from "react-native";
// import { Button, Input } from "react-native-elements";
// import { useNavigation } from "@react-navigation/native";
// import { IconButton } from "react-native-paper";
// export default function HomePage({ session }) {
//   const [loading, setLoading] = useState(true);
//   const [username, setUsername] = useState("");
//   // const [website, setWebsite] = useState("");
//   // const [avatarUrl, setAvatarUrl] = useState("");
//   const [subscriptions, setSubscriptions] = useState([]);
//   const navigation = useNavigation();
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
//         .select(`id, email`)
//         .eq("id", session.user.id)
//         .single();

//       // console.log(data);
//       if (error && status !== 406) {
//         throw error;
//       }

//       if (data) {
//         // setUsername(data.username);
//         // console.log(data);
//         // setWebsite(data.website);
//         // setAvatarUrl(data.avatar_url);
//       }
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
//       fetchUserSubscriptions();
//     } catch (error) {
//       console.error("Error deleting subscription:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <ImageBackground
//       source={require("../assets/homepage-bg.jpg")}
//       style={styles.backgroundImage}
//     >
//       <View style={styles.container}>
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           {/* <Text>{session?.user?.email || "No user"}</Text> */}
//           <View style={styles.headerContainer}>
//             <Text style={styles.headerText}>User Subscriptions</Text>
//             <IconButton
//               icon="logout" // Replace with the name of your PNG image (without the file extension)
//               onPress={() => supabase.auth.signOut()}
//             />
//           </View>
//           <View>
//             {subscriptions.map((subscription, index) => (
//               <View key={index} style={styles.subscriptionItem}>
//                 <SubscriptionCard
//                   subscription={subscription}
//                   onDelete={() => deleteSubscription(subscription.id)}
//                 />
//                 {/* Display other subscription details */}
//               </View>
//             ))}
//           </View>

//           {/* <Button title="Sign Out" onPress={() => supabase.auth.signOut()} /> */}
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
//   headerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
// });
