import React, { useState } from "react";
import { Alert, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input, Text } from "react-native-elements";
import { ImageBackground } from "react-native";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

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
          <View style={styles.tabs}>
            <Text
              style={[
                styles.tabText,
                isSignUp ? styles.inactiveTabText : styles.activeTabText,
              ]}
              onPress={() => setIsSignUp(false)}
            >
              Sign In
            </Text>
            <Text
              style={[
                styles.tabText,
                isSignUp ? styles.activeTabText : styles.inactiveTabText,
              ]}
              onPress={() => setIsSignUp(true)}
            >
              Sign Up
            </Text>
          </View>

          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Input
              label="Email"
              leftIcon={{ type: "font-awesome", name: "envelope" }}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.verticallySpaced}>
            <Input
              label="Password"
              leftIcon={{ type: "font-awesome", name: "lock" }}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.verticallySpaced, styles.mt50]}>
            <Button
              title={isSignUp ? "Sign Up" : "Sign In"}
              disabled={loading}
              onPress={() => handleAuthentication()}
              buttonStyle={styles.button} // Customize button background color
              titleStyle={styles.buttonText} // Customize button text color
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
    marginTop: 150,
  },
  mt50: {
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
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    width: "50%",
  },
  activeTabText: {
    color: "black",
  },
  inactiveTabText: {
    color: "gray",
  },
});

// import React, { useState } from "react";
// import { Alert, StyleSheet, View, KeyboardAvoidingView } from "react-native";
// import { supabase } from "../lib/supabase";
// import { Button, Input } from "react-native-elements";
// import { ImageBackground } from "react-native";

// export default function Auth() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function signInWithEmail() {
//     setLoading(true);

//     const { error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });

//     if (error) Alert.alert(error.message);

//     setLoading(false);
//   }

//   async function signUpWithEmail() {
//     setLoading(true);

//     const { error } = await supabase.auth.signUp({
//       email: email,
//       password: password,
//     });

//     if (error) Alert.alert(error.message);

//     setLoading(false);
//   }

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
//       <ImageBackground
//         source={require("../assets/login-bg.jpg")}
//         style={styles.backgroundImage}
//       >
//         <View style={[styles.verticallySpaced, styles.mt20]}>
//           <Input
//             label="Email"
//             leftIcon={{ type: "font-awesome", name: "envelope" }}
//             onChangeText={(text) => setEmail(text)}
//             value={email}
//             placeholder="email@address.com"
//             autoCapitalize={"none"}
//           />
//         </View>

//         <View style={styles.verticallySpaced}>
//           <Input
//             label="Password"
//             leftIcon={{ type: "font-awesome", name: "lock" }}
//             onChangeText={(text) => setPassword(text)}
//             value={password}
//             secureTextEntry={true}
//             placeholder="Password"
//             autoCapitalize={"none"}
//           />
//         </View>

//         <View style={[styles.verticallySpaced, styles.mt50]}>
//           <Button
//             title="Sign in"
//             disabled={loading}
//             onPress={() => signInWithEmail()}
//             buttonStyle={styles.button} // Customize button background color
//             titleStyle={styles.buttonText} // Customize button text color
//           />
//         </View>

//         <View style={styles.verticallySpaced}>
//           <Button
//             title="Sign up"
//             disabled={loading}
//             onPress={() => signUpWithEmail()}
//             buttonStyle={styles.button} // Customize button background color
//             titleStyle={styles.buttonText} // Customize button text color
//           />
//         </View>
//       </ImageBackground>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center", // Center vertically
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
//     marginTop: 150,
//   },
//   mt50: {
//     marginTop: 20,
//   },
//   button: {
//     backgroundColor: "white", // Customize button background color
//   },
//   buttonText: {
//     color: "black", // Customize button text color
//   },
// });
