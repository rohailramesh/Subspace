import React, { useState } from "react";
import { Alert, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input, Icon } from "react-native-elements";
import { ImageBackground } from "react-native";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  async function handleAuthentication() {
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      setEmail("");
      setPassword("");
      if (error) Alert.alert(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) Alert.alert(error.message);
    }

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ImageBackground
        source={require("../assets/login-bg2.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <View style={[styles.verticallySpaced]}>
            <Input
              label="Email"
              leftIcon={{
                type: "font-awesome",
                name: "envelope",
                color: "white",
              }}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize="none"
              style={{ color: "white" }}
            />
          </View>

          <View style={styles.verticallySpaced}>
            <Input
              label="Password"
              leftIcon={{ type: "font-awesome", name: "lock", color: "white" }}
              rightIcon={
                <Icon
                  type="font-awesome"
                  name={secureTextEntry ? "eye-slash" : "eye"}
                  color="white"
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={secureTextEntry}
              placeholder="Password"
              autoCapitalize="none"
              style={{ color: "white" }}
            />
          </View>

          <View style={[styles.verticallySpaced]}>
            <Button
              title={isSignUp ? "Sign Up" : "Sign In"}
              disabled={loading}
              onPress={() => handleAuthentication()}
              buttonStyle={styles.button} // Customize button background color
              titleStyle={styles.buttonText} // Customize button text color
            />
          </View>
          <View style={styles.tabs}>
            <Button
              title="Sign In"
              type="clear"
              titleStyle={[
                styles.tabText,
                isSignUp ? styles.inactiveTabText : styles.activeTabText,
              ]}
              onPress={() => setIsSignUp(false)}
              buttonStyle={[styles.button, styles.roundedButton]}
            />
            <Button
              title="Sign Up"
              type="clear"
              titleStyle={[
                styles.tabText,
                isSignUp ? styles.activeTabText : styles.inactiveTabText,
              ]}
              onPress={() => setIsSignUp(true)}
              buttonStyle={[styles.button, styles.roundedButton]}
            />
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center vertically
    padding: 12,
    marginTop: 20,
  },
  backgroundImage: {
    flex: 1, // Take up the entire screen
    resizeMode: "cover", // Adjust the image size to cover the entire container
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
    marginTop: 20,
  },
  button: {
    backgroundColor: "white", // Customize button background color
  },
  buttonText: {
    color: "black", // Customize button text color
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100,
    paddingRight: 20,
    gap: 5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    width: "50%",
  },
  inactiveTabText: {
    color: "grey",
  },
  activeTabText: {
    color: "black",
  },

  roundedButton: {
    borderRadius: 5, // Adjust the value as needed
  },
});
