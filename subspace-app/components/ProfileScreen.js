import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

// import { useState, useEffect } from "react";
// import { supabase } from "../lib/supabase";

// import { StyleSheet, View, Alert, Text } from "react-native";
// import { Button, Input } from "react-native-elements";
// import { useNavigation } from "@react-navigation/native";
// export default function HomePage({ session }) {
//   const [loading, setLoading] = useState(true);
//   const [username, setUsername] = useState("");
//   const [website, setWebsite] = useState("");
//   const [avatarUrl, setAvatarUrl] = useState("");
//   const navigation = useNavigation();
//   useEffect(() => {
//     getProfile();
//   }, [session]);

//   async function getProfile() {
//     try {
//       setLoading(true);

//       if (!session?.user) {
//         throw new Error("No user on the session!");
//       }

//       let { data, error, status } = await supabase
//         .from("profiles")
//         .select(`username, website, avatar_url`)
//         .eq("id", session.user.id)
//         .single();

//       if (error && status !== 406) {
//         throw error;
//       }

//       if (data) {
//         setUsername(data.username);
//         setWebsite(data.website);
//         setAvatarUrl(data.avatar_url);
//       }
//     } catch (error) {
//       Alert.alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function updateProfile({ username, website, avatar_url }) {
//     try {
//       setLoading(true);
//       if (!session?.user) throw new Error("No user on the session!");

//       const updates = {
//         id: session?.user.id,
//         username,
//         website,
//         avatar_url,
//         updated_at: new Date(),
//       };

//       let { error } = await supabase.from("profiles").upsert(updates);

//       if (error) {
//         throw error;
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         Alert.alert(error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     // <View style={styles.container}>
//     //   <Text>{session?.user?.email || "No user"}</Text>

//     //   <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />

//     //   <Button
//     //     title="Go to Manage"
//     //     onPress={() => navigation.navigate("Manage")}
//     //   />
//     // </View>
//     <View style={styles.container}>
//       <View style={[styles.verticallySpaced, styles.mt20]}>
//         <Input label="Email" value={session?.user?.email} disabled />
//       </View>

//       <View style={styles.verticallySpaced}>
//         <Input
//           label="Username"
//           value={username || ""}
//           onChangeText={(text) => setUsername(text)}
//         />
//       </View>

//       <View style={styles.verticallySpaced}>
//         <Input
//           label="Website"
//           value={website || ""}
//           onChangeText={(text) => setWebsite(text)}
//         />
//       </View>

//       <View style={[styles.verticallySpaced, styles.mt20]}>
//         <Button
//           title={loading ? "Loading ..." : "Update"}
//           onPress={() =>
//             updateProfile({ username, website, avatar_url: avatarUrl })
//           }
//           disabled={loading}
//         />
//       </View>

//       <View style={styles.verticallySpaced}>
//         <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 40,
//     padding: 12,
//   },
//   verticallySpaced: {
//     paddingTop: 4,
//     paddingBottom: 4,
//     alignSelf: "stretch",
//   },
//   mt20: {
//     marginTop: 20,
//   },
// });