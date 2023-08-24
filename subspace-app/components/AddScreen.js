import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import {
  View,
  TextInput,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { IconButton } from "react-native-paper";
import { Button } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";
import { DatePickerInput } from "react-native-paper-dates";
import { Alert } from "react-native";
import { Text } from "react-native-paper";
const subscriptionTypes = [
  { label: "Paid", value: "Paid" },
  { label: "Trial", value: "Trial" },
];

const subscriptionStatuses = [
  { label: "Active", value: "Active" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Expired", value: "Expired" },
];

const subscriptionCategories = [
  { label: "Entertainment", value: "Entertainment" },
  { label: "News/Info", value: "News/Info" },
  { label: "Lifestyle", value: "Lifestyle" },
  { label: "Productivity", value: "Productivity" },
  { label: "Finance", value: "Finance" },
  { label: "Education", value: "Education" },
  { label: "Services", value: "Services" },
];

const billingPeriodType = [
  { label: "Monthly", value: "Monthly" },
  { label: "Annually", value: "Annually" },
  { label: "Quaterly", value: "Quaterly" },
  { label: "Biannually", value: "Biannually" },
];

export default function AddScreen({ session }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [category, setCategory] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState(null);
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [nextBillingDate, setNextBillingDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isFocus, setIsFocus] = useState(false);

  const addSubscription = async () => {
    if (
      !name ||
      !price ||
      !type ||
      !status ||
      !category ||
      !billingPeriod ||
      !startDate ||
      !nextBillingDate ||
      !endDate
    ) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    const { data, error } = await supabase.from("subspace").insert({
      user_id: session.user.id,
      name: name,
      price: price,
      type: type,
      status: status,
      category: category,
      billing_period: billingPeriod,
      notes: notes,
      start_date: startDate,
      end_date: endDate,
      next_billing_date: nextBillingDate,
    });
    if (error) {
      console.log(error);
    } else {
      Alert.alert(
        "Subscription Added",
        "Please refresh your subscriptions if needed"
      );
      setName("");
      setPrice("");
      setNotes("");
      setType(null);
      setStatus(null);
      setBillingPeriod(null);
      setCategory(null);
      setStartDate(new Date());
      setEndDate(new Date());
      setNextBillingDate(new Date());
    }
  };

  async function resetForm() {
    setName("");
    setPrice("");
    setNotes("");
    setType(null);
    setStatus(null);
    setBillingPeriod(null);
    setCategory(null);
    setStartDate(new Date());
    setEndDate(new Date());
    setNextBillingDate(new Date());
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
            <Text style={styles.headerText}>Add New Subscription</Text>
            <IconButton
              icon="lock-reset" // Replace with the name of the refresh icon
              onPress={resetForm} // Trigger the fetchUserSubscriptions function
            />
            <IconButton
              icon="location-exit" // Replace with the name of your PNG image (without the file extension)
              onPress={() => supabase.auth.signOut()}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text variant="bodyMedium" style={styles.boldText}>
              Subscription name:
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Add Subscription Name"
              style={styles.input}
              required
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text variant="bodyMedium" style={styles.boldText}>
              Subscription price:
            </Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="Add Subscription Price"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.boldText} variant="bodyMedium">
              Extra notes:
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add extra notes regarding subscription"
              style={styles.input}
            />
          </View>

          <View style={styles.datePicker}>
            <Text style={styles.boldText}>Subscription Start Date </Text>
            <DatePickerInput
              value={startDate}
              onChange={(d) => setStartDate(d)}
              inputMode="start"
              style={{ width: 200 }}
              mode="outlined"
            />
          </View>

          <View style={styles.datePicker}>
            <Text style={styles.boldText}>Subscription End Date </Text>
            <DatePickerInput
              value={endDate}
              onChange={(d) => setEndDate(d)}
              inputMode="start"
              style={{ width: 200 }}
              mode="outlined"
            />
          </View>

          <View style={styles.datePicker}>
            <Text style={styles.boldText}>Subscription Next Billing Date </Text>
            <DatePickerInput
              value={nextBillingDate}
              onChange={(d) => setNextBillingDate(d)}
              inputMode="start"
              style={{ width: 200, borderWidth: 0 }}
              mode="outlined"
            />
          </View>

          <View style={styles.dropdownBox}>
            <Dropdown
              style={[
                dropdownStyles.dropdown,
                isFocus && { borderColor: "blue" },
              ]}
              data={subscriptionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={
                <Text style={styles.boldText}>Subscription Type </Text>
              }
              value={type}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setType(item.value);
                setIsFocus(false);
              }}
            />
          </View>

          <View style={styles.dropdownBox}>
            <Dropdown
              style={[
                dropdownStyles.dropdown,
                isFocus && { borderColor: "blue" },
              ]}
              data={subscriptionStatuses}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={
                <Text style={styles.boldText}>Subscription Status</Text>
              }
              value={status}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setStatus(item.value);
                setIsFocus(false);
              }}
            />
          </View>

          <View style={styles.dropdownBox}>
            <Dropdown
              style={[
                dropdownStyles.dropdown,
                isFocus && { borderColor: "blue" },
              ]}
              data={subscriptionCategories}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={
                <Text style={styles.boldText}>Subscription Category</Text>
              }
              value={category}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setCategory(item.value);
                setIsFocus(false);
              }}
            />
          </View>

          <View style={styles.dropdownBox}>
            <Dropdown
              style={[
                dropdownStyles.dropdown,
                isFocus && { borderColor: "blue" },
              ]}
              data={billingPeriodType}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={
                <Text style={styles.boldText}>Subscription Billing Period</Text>
              }
              value={billingPeriod}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setBillingPeriod(item.value);
                setIsFocus(false);
              }}
            />
          </View>

          <Button
            title="Add Subscription"
            // type="clear"
            onPress={addSubscription}
            buttonStyle={[styles.button, styles.roundedButton]}
          />
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
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
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
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 0.9,
    borderColor: "black",
    borderRadius: 8,
    padding: 8,
  },
  dropdownBox: {
    justifyContent: "space-between",
    marginBottom: 18,
    // flexDirection: "row",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    // paddingHorizontal: 8,
    paddingLeft: 6,
    backgroundColor: "white", // Add a background color
    borderRadius: 8,
  },
  button: {
    backgroundColor: "black", // Customize button background color
  },
  buttonText: {
    color: "white", // Customize button text color
  },
});

const dropdownStyles = StyleSheet.create({
  dropdown: {
    height: 50,
    // borderColor: "gray",
    // borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
});
