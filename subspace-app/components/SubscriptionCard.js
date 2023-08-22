import React from "react";
import { Card, Text, Button } from "react-native-paper";

const SubscriptionCard = ({ subscription, onDelete }) => {
  return (
    <Card style={styles.outlinedCard}>
      <Card.Content>
        <Text variant="titleLarge">{subscription.name}</Text>
        <Text variant="bodyMedium">Price: £{subscription.price}</Text>
        {/* Add other subscription details */}
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
    borderColor: "black",
    borderRadius: 10,
    // overflow: 'hidden', // Remove this line
  },
};

export default SubscriptionCard;
