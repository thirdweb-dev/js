import { Icon } from "../../assets/icon";
import { useAppTheme } from "../../styles/hooks";
import { Address } from "../base/Address";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { WalletIcon } from "../base/WalletIcon";
import { useWallet, useBalance } from "@thirdweb-dev/react-core";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Box from "../base/Box";
import CopyIcon from "../../assets/copy";
import { SmartWallet } from "@thirdweb-dev/wallets";

interface WalletDetailsModalHeaderProps {
  address: string;
  onDisconnectPress: () => void;
  onAddressCopied?: () => void;
  loading?: boolean;
}

export const WalletDetailsModalHeader = ({
  address,
  onDisconnectPress,
  onAddressCopied,
  loading,
}: WalletDetailsModalHeaderProps) => {
  const theme = useAppTheme();
  const balanceQuery = useBalance();
  const activeWallet = useWallet();

  const onAddressPress = async () => {
    let toCopy;
    if (activeWallet?.walletId === SmartWallet.id) {
      toCopy = (activeWallet as SmartWallet).getConnectParams()?.accountId;
    }

    toCopy = toCopy || address;

    await Clipboard.setStringAsync(toCopy);
    onAddressCopied?.();
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
            gap="xs"
            justifyContent="center"
            alignItems="center"
          >
            {activeWallet?.walletId === SmartWallet.id ? (
              <Text variant="bodyLarge">
                {(activeWallet as SmartWallet).getConnectParams()?.accountId}
              </Text>
            ) : (
              <Address address={address} />
            )}
            <CopyIcon
              width={14}
              height={14}
              color={theme.colors.textSecondary}
            />
          </Box>
          <Text variant="bodySmallSecondary">
            {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
            {balanceQuery.data?.symbol}
          </Text>
        </BaseButton>
        {loading ? (
          <ActivityIndicator size={18} color={theme.colors.iconHighlight} />
        ) : (
          <Icon
            type="disconnect"
            width={18}
            height={18}
            onPress={onDisconnectPress}
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
