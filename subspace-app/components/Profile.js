import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-elements";
import { IconButton } from "react-native-paper";
export default function Profile({ session }) {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      if (!session?.user) {
        throw new Error("No user on the session!");
      }

      let { data, error, status } = await supabase
        .from("profile")
        .select(`id, name, email`) // Include the 'name' field
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setName(data.name);
        setEmail(data.email);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);

      if (!session?.user) throw new Error("No user on the session!");

      let { error } = await supabase.from("profile").upsert({
        id: session?.user.id,
        name: name,
      });

      if (error) {
        throw error;
      } else {
        setName(name);
        Alert.alert(
          "Name saved sucessfully",
          "Log back in to see updated name"
        );
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updatePassword() {
    try {
      if (!session?.user) {
        throw new Error("No user on the session!");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      } else {
        Alert.alert("Success", "Password updated");
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
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
            {!name ? (
              <Text style={styles.headerText}>Profile</Text>
            ) : (
              <Text style={styles.headerText}>{name}'s Profile</Text>
            )}
            <IconButton
              icon="location-exit" // Replace with the name of your PNG image (without the file extension)
              onPress={() => supabase.auth.signOut()}
            />
          </View>
          <View>
            <View>
              <View style={styles.fieldContainer}>
                <Text style={styles.boldText}>Email:</Text>
                <TextInput
                  value={email}
                  placeholder={email}
                  style={styles.input}
                  editable={false}
                />
              </View>
            </View>
            <View>
              <View style={styles.fieldContainer}>
                <Text style={styles.boldText}>Name:</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Name"
                  style={styles.input}
                />
              </View>
              <Button
                title="Save Name"
                onPress={() => {
                  setName(name); // Set the nameSaved state to true
                  updateProfile();
                }}
                buttonStyle={[styles.button, styles.roundedButton]}
              />
            </View>
          </View>
          <View style={{ marginTop: 15 }}>
            <View style={styles.fieldContainer}>
              <Text style={styles.boldText}>New Password:</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter New Password"
                secureTextEntry
                style={styles.input}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.boldText}>Confirm Password:</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm New Password"
                secureTextEntry
                style={styles.input}
              />
            </View>
            <Button
              title="Update Password"
              onPress={updatePassword}
              buttonStyle={[styles.button, styles.roundedButton]}
            />
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
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 0.9,
    borderColor: "black",
    borderRadius: 8,
    padding: 8,
  },
  button: {
    backgroundColor: "black", // Customize button background color
  },
  buttonText: {
    color: "white", // Customize button text color
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    // paddingHorizontal: 8,
    paddingLeft: 6,
    backgroundColor: "white", // Add a background color
    borderRadius: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
});
