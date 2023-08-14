import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const data = [
  { label: "Paid", value: "Paid" },
  { label: "Trial", value: "Trial" },
];

export default function AddScreen({ session }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const addSubscription = async () => {
    const { data, error } = await supabase.from("subspace_app").insert({
      user_id: session.user.id,
      name: name,
      price: price,
      type: type,
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

      <Dropdown
        style={[dropdownStyles.dropdown, isFocus && { borderColor: "blue" }]}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Subscription Type"}
        value={type}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setType(item.value);
          setIsFocus(false);
        }}
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
});

const dropdownStyles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
