import BaseButton from "../base/BaseButton";
import { ChainIcon } from "../base/ChainIcon";
import Text from "../base/Text";
import { StyleSheet } from "react-native";

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
    <BaseButton
      p="md"
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
