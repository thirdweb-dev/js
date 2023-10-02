import ImageSvgUri from "./ImageSvgUri";
import { StyleSheet, View } from "react-native";

const defaultChainIcon =
  "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png";

export type ChainIconProps = {
  chainIconUrl?: string;
  size: number;
};

export const ChainIcon = ({ chainIconUrl, size }: ChainIconProps) => {
  const src = chainIconUrl || defaultChainIcon;

  return (
    <View style={styles.container}>
      <ImageSvgUri width={size} height={size} imageUrl={src} />
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
