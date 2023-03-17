import { ActiveDot } from "./ActiveDot";
import { resolveIpfsUri } from "@thirdweb-dev/react-core";
import { Image, StyleSheet, View } from "react-native";

const defaultChainIcon = resolveIpfsUri(
  "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
);

export type ChainIconProps = {
  chainIconUrl?: string;
  size: number;
  active?: boolean;
};

export const ChainIcon = ({ chainIconUrl, size, active }: ChainIconProps) => {
  const src = chainIconUrl ? resolveIpfsUri(chainIconUrl) : defaultChainIcon;

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
