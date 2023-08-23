import React from "react";
import { Card, Text, Button } from "react-native-paper";

const SubscriptionCard = ({ subscription, onDelete }) => {
  return (
    <Card style={styles.outlinedCard}>
      <Card.Content>
        <Text variant="titleLarge">{subscription.name}</Text>
        <Text variant="bodyMedium">
          <Text style={styles.boldText}>Price:</Text> £{subscription.price}
        </Text>
        <Text variant="bodyMedium">
          <Text style={styles.boldText}>Type:</Text> {subscription.type}{" "}
          subscription
        </Text>
        <Text variant="bodyMedium">
          <Text style={styles.boldText}>Status:</Text> {subscription.status}
        </Text>
        <Text variant="bodyMedium">
          <Text style={styles.boldText}>Category:</Text>
          {subscription.category}
        </Text>
        <Text variant="bodyMedium">
          <Text style={styles.boldText}>Next Billing Date:</Text>{" "}
          {subscription.next_billing_date}
        </Text>
        <Text variant="bodyMedium">
          <Text style={styles.boldText}>Start Date:</Text>{" "}
          {subscription.start_date}
        </Text>
        <Text variant="bodyMedium">
          <Text style={styles.boldText}>End Date:</Text> {subscription.end_date}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onDelete}>Delete</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = {
  outlinedCard: {
    padding: 5,
    backgroundColor: "white",
    borderWidth: 2,
    // borderColor: "black",
    borderRadius: 10,
    marginBottom: 10, // Add margin bottom to create a gap between cards
    // overflow: 'hidden', // You can keep or remove this line based on your design
  },
  boldText: {
    fontWeight: "bold",
  },
};

export default SubscriptionCard;
