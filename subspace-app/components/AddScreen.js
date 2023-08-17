import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { DatePickerInput } from "react-native-paper-dates";

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
  const [isFocus, setIsFocus] = useState(false);

  const addSubscription = async () => {
    const { data, error } = await supabase.from("subspace_app").insert({
      user_id: session.user.id,
      name: name,
      price: price,
      type: type,
      status: status,
      category: category,
      billing_period: billingPeriod,
      notes: notes,
      start_date: startDate,
    });
    if (error) {
      console.log(error);
    } else {
      setName("");
      setPrice("");
      setNotes("");
      setType(null);
      setStatus(null);
      setBillingPeriod(null);
      setCategory(null);
      setStartDate(new Date());
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

      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Add extra notes regarding subscription"
      />

      <DatePickerInput
        // locale="en"
        label="Subscription Start Date"
        value={startDate}
        onChange={(d) => setStartDate(d)}
        inputMode="start"
        style={{ width: 200 }}
        mode="outlined"
      />

      <Dropdown
        style={[dropdownStyles.dropdown, isFocus && { borderColor: "blue" }]}
        data={subscriptionTypes}
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

      <Dropdown
        style={[dropdownStyles.dropdown, isFocus && { borderColor: "blue" }]}
        data={subscriptionStatuses}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Subscription Status"}
        value={status}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setStatus(item.value);
          setIsFocus(false);
        }}
      />

      <Dropdown
        style={[dropdownStyles.dropdown, isFocus && { borderColor: "blue" }]}
        data={subscriptionCategories}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Subscription Category"}
        value={category}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setCategory(item.value);
          setIsFocus(false);
        }}
      />

      <Dropdown
        style={[dropdownStyles.dropdown, isFocus && { borderColor: "blue" }]}
        data={billingPeriodType}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={"Billing Period"}
        value={billingPeriod}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setBillingPeriod(item.value);
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
