import { Theme } from "../../styles/theme";
import BaseButton from "./BaseButton";
import { ChainIcon } from "./ChainIcon";
import Text from "./Text";
import { StyleSheet } from "react-native";

interface NetworkButtonProps {
  chainIconUrl?: string;
  chainName: string;
  padding?: keyof Theme["spacing"];
  onPress: () => void;
}

export const NetworkButton = ({
  onPress,
  chainName,
  chainIconUrl,
  padding,
}: NetworkButtonProps) => {
  return (
    <BaseButton
      p={padding || "md"}
      backgroundColor="background"
      style={styles.networkContainer}
      onPress={onPress}
      borderColor="border"
    >
      {chainIconUrl ? (
        <ChainIcon chainIconUrl={chainIconUrl} size={32} active={false} />
      ) : null}
      <Text variant="bodyLarge" style={styles.networkText}>
        {chainName}
      </Text>
      {/* <RightArrowIcon size={10} /> */}
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  networkText: {
    marginLeft: 16,
  },
  networkContainer: {
    borderRadius: 8,
    borderWidth: 0.5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
