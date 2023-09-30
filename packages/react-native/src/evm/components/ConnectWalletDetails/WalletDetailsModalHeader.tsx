import { Icon } from "../../assets/icon";
import { useAppTheme } from "../../styles/hooks";
import { AddressDisplay } from "../base/AddressDisplay";
import BaseButton from "../base/BaseButton";
import { WalletIcon } from "../base/WalletIcon";
import { useENS, useWallet } from "@thirdweb-dev/react-core";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Box from "../base/Box";
import CopyIcon from "../../assets/copy";
import { useMemo, useState } from "react";
import { TextBalance } from "../base/TextBalance";
import { walletIds } from "@thirdweb-dev/wallets";
import { SMART_WALLET_ICON } from "../../assets/svgs";
import Text from "../base/Text";

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
  const ensQuery = useENS();

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

  const ens = useMemo(() => ensQuery.data?.ens, [ensQuery.data?.ens]);
  const avatarUrl = useMemo(
    () => ensQuery.data?.avatarUrl,
    [ensQuery.data?.avatarUrl],
  );

  const walletIconUrl =
    activeWallet?.walletId === walletIds.smartWallet
      ? SMART_WALLET_ICON
      : activeWallet?.getMeta().iconURL || "";

  return (
    <>
      <View style={styles.header}>
        <WalletIcon size={40} iconUri={avatarUrl || walletIconUrl} />
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
            {ens ? (
              <Text mr="xs" variant="bodyLarge">
                {ens}
              </Text>
            ) : (
              <AddressDisplay mr="xs" address={address} extraShort={false} />
            )}
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
