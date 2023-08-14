// import { View, Text } from "react-native";

// export default function AddScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>Add Screen</Text>
//     </View>
//   );
// }

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function AddScreen({ session }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addSubscription = async () => {
    const { data, error } = await supabase.from("subspace_app").insert({
      user_id: session.user.id,
      name: name,
      price: price,
    });
    if (error) {
      console.log(error);
    } else {
      setName("");
      setPrice("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Add Subscription Name"
        required
      />

      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Add Subscription Price"
        keyboardType="numeric"
      />
      <Button title="Add Subscription" onPress={addSubscription} />
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
