import { Icon } from "../../assets/icon";
import { useAppTheme } from "../../styles/hooks";
import { IWalletWithMetadata } from "../../types/wallets";
import { Address } from "../base/Address";
import Text from "../base/Text";
import { WalletIcon } from "../base/WalletIcon";
import { useActiveWallet, useBalance } from "@thirdweb-dev/react-core";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface WalletDetailsModalHeaderProps {
  address: string;
  onDisconnectPress: () => void;
  loading?: boolean;
}

export const WalletDetailsModalHeader = ({
  address,
  onDisconnectPress,
  loading,
}: WalletDetailsModalHeaderProps) => {
  const theme = useAppTheme();
  const balanceQuery = useBalance();
  const activeWallet = useActiveWallet();

  return (
    <>
      <View style={styles.header}>
        <WalletIcon
          size={40}
          iconUri={
            (activeWallet as unknown as IWalletWithMetadata).getMetadata()
              .image_url || ""
          }
        />
        <View style={styles.walletInfo}>
          <Address address={address} />
          <Text variant="bodySmallSecondary">
            {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
            {balanceQuery.data?.symbol}
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator size={18} color={theme.colors.iconHighlight} />
        ) : (
          <Icon
            type="disconnect"
            size={18}
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
  walletInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    marginLeft: 16,
  },
});
