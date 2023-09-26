import { Icon } from "../../assets/icon";
import { useAppTheme } from "../../styles/hooks";
import { AddressDisplay } from "../base/AddressDisplay";
import BaseButton from "../base/BaseButton";
import { WalletIcon } from "../base/WalletIcon";
import { useWallet } from "@thirdweb-dev/react-core";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Box from "../base/Box";
import CopyIcon from "../../assets/copy";
import { useState } from "react";
import { TextBalance } from "../base/TextBalance";

interface WalletDetailsModalHeaderProps {
  address?: string;
  onDisconnectPress: () => void;
  onAddressCopied?: () => void;
  loading?: boolean;
  tokenAddress?: string;
}

export const WalletDetailsModalHeader = ({
  address,
  onDisconnectPress,
  onAddressCopied,
  tokenAddress,
}: WalletDetailsModalHeaderProps) => {
  const theme = useAppTheme();
  const activeWallet = useWallet();
  const [showLoading, setShowLoading] = useState(false);

  const onAddressPress = async () => {
    if (!address) {
      return;
    }
    await Clipboard.setStringAsync(address);
    onAddressCopied?.();
  };

  const onDisconnectPressInternal = () => {
    setShowLoading(true);
    setTimeout(() => {
      onDisconnectPress();
    }, 0);
  };

  return (
    <>
      <View style={styles.header}>
        <WalletIcon size={40} iconUri={activeWallet?.getMeta().iconURL || ""} />
        <BaseButton
          flex={1}
          justifyContent="flex-start"
          alignItems="flex-start"
          ml="md"
          onPress={onAddressPress}
        >
          <Box
            flexDirection="row"
            mr="sm"
            justifyContent="center"
            alignItems="center"
          >
            <AddressDisplay mr="xs" address={address} extraShort={false} />
            <CopyIcon
              width={14}
              height={14}
              color={theme.colors.textSecondary}
            />
          </Box>
          <TextBalance
            textVariant="bodySmallSecondary"
            tokenAddress={tokenAddress}
          />
        </BaseButton>
        {showLoading ? (
          <ActivityIndicator size="small" color={theme.colors.iconHighlight} />
        ) : (
          <Icon
            type="disconnect"
            width={18}
            height={18}
            onPress={onDisconnectPressInternal}
            color={theme.colors.iconHighlight}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
