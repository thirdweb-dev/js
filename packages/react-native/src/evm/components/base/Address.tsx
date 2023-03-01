import { shortenString } from "../../utils/addresses";
import React from "react";
import { TextStyle } from "react-native";
import { StyleSheet, Text } from "react-native/";

export const Address = ({
  address,
  style,
}: {
  address: string;
  style?: TextStyle;
}) => {
  return (
    <Text style={{ ...styles.text, ...style }}>{shortenString(address)}</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#F1F1F1",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
  },
});
