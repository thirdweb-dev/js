import { ChainIcon } from "../base/ChainIcon";
import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

interface NetworkButtonProps {
  chainIconUrl?: string;
  chainName: string;
  onPress: () => void;
}

export const NetworkButton = ({
  onPress,
  chainName,
  chainIconUrl,
}: NetworkButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.networkContainer}
      onPress={onPress}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
      <ChainIcon chainIconUrl={chainIconUrl} size={32} active={false} />
      <Text style={styles.networkText}>{chainName}</Text>
      {/* <RightArrowIcon size={10} /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  networkText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: "#F1F1F1",
  },
  networkContainer: {
    borderRadius: 8,
    borderColor: "#2E3339",
    borderWidth: 0.5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginTop: 13,
  },
});
