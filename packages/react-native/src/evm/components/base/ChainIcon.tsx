import { ActiveDot } from "./ActiveDot";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const defaultChainIcon =
  "https://gateway.ipfscdn.io/ipfs/QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png";

export type ChainIconProps = {
  chainIconUrl?: string;
  size: number;
  active?: boolean;
};

export const ChainIcon = ({ chainIconUrl, size, active }: ChainIconProps) => {
  const src = chainIconUrl
    ? `https://gateway.ipfscdn.io/ipfs/${chainIconUrl.replace("ipfs://", "")}`
    : defaultChainIcon;

  return (
    <View style={styles.container}>
      <Image
        alt="chain icon"
        style={{ width: size, height: size }}
        source={{ uri: src }}
      />
      {active ? <ActiveDot /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
});
