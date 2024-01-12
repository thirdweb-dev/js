import { Image, StyleSheet } from "react-native";
import BaseButton from "../../../components/base/BaseButton";
import { WCWallet } from "../../../types/wc";
import Text from "../../../components/base/Text";
import { WCMeta } from "../../types/wc";
import { useState } from "react";
import WalletLoadingThumbnail from "./WalletLoadingThumbnail";

const WALLET_MARGIN = 8;
const WALLET_HEIGHT = 80;

export const WalletConnectButton = ({
  item,
  onPress,
}: {
  item: WCWallet;
  onPress: (item: WCMeta) => void;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const onWalletPress = () => {
    setIsAnimating(true);
    onPress(item);
  };

  return (
    <BaseButton
      flexDirection="column"
      style={styles.buttonContainer}
      onPress={onWalletPress}
    >
      {isAnimating ? (
        <WalletLoadingThumbnail imageSize={55}>
          <Image
            alt={item.name}
            source={{ uri: item.iconURL }}
            style={[
              {
                borderWidth: 1,
                height: 50,
                width: 50,
                borderRadius: 30 / 3.5,
              },
            ]}
          />
        </WalletLoadingThumbnail>
      ) : (
        <Image
          alt={item.name}
          source={{ uri: item.iconURL }}
          style={[
            {
              borderWidth: 0,
              height: 50,
              width: 50,
              borderRadius: 30 / 3.5,
            },
          ]}
        />
      )}
      <Text
        variant="bodySmallSecondary"
        fontSize={12}
        numberOfLines={1}
        mt="xxs"
      >
        {item.name.split(" ")[0]}
      </Text>
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: 50,
    height: 50,
    overflow: "hidden",
    position: "relative",
  },
  buttonContainer: {
    flex: 1,
    height: WALLET_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: WALLET_MARGIN,
  },
});
