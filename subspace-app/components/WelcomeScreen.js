import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { supabase } from "../lib/supabase";

const WelcomeScreen = ({ session, onWelcomeComplete }) => {
  const [visible, setVisible] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onWelcomeComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!session?.user) {
          throw new Error("No user on the session!");
        }

        let { data, error, status } = await supabase
          .from("profile")
          .select(`id, email, name`)
          .eq("id", session.user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        setName(data?.name || "");
      } catch (error) {
        console.error(error);
      }
    }

    fetchProfile();
  }, [session]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Your welcome screen UI here */}
      <Text style={{ fontSize: 24 }}>
        {name.length === 0 ? "Welcome" : `Welcome, ${name}`}
      </Text>
      <Image source={require("../assets/welcome.jpeg")} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: 300,
    height: 200,
    marginLeft: 10,
  },
});

export default WelcomeScreen;
