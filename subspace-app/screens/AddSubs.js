import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const AddSubs = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Add Subs</Text>
      <Button title="Click Here" onPress={() => alert("Button Clicked!")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});

export default AddSubs;
