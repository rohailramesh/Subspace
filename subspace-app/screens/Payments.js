import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const Payments = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Payments</Text>
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

export default Payments;
