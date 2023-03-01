import { DisconnectIcon } from "../../assets/disconnect";
import { useActiveWalletMeta } from "../../contexts/wallets-context";
import { Address } from "../base/Address";
import { WalletIcon } from "../base/WalletIcon";
import { useBalance } from "@thirdweb-dev/react-core";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

interface WalletDetailsModalHeaderProps {
  address: string;
  onDisconnectPress: () => void;
}

export const WalletDetailsModalHeader = ({
  address,
  onDisconnectPress,
}: WalletDetailsModalHeaderProps) => {
  const balanceQuery = useBalance();
  const activeWalletMeta = useActiveWalletMeta();

  return (
    <>
      <View style={styles.header}>
        <WalletIcon size={40} iconUri={activeWalletMeta?.image_url || ""} />
        <View style={styles.walletInfo}>
          <Address address={address} />
          <Text style={styles.balance}>
            {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
            {balanceQuery.data?.symbol}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => onDisconnectPress()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <DisconnectIcon size={18} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  balance: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16,
    color: "#646D7A",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
    color: "#F1F1F1",
  },
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
  closeContainer: {
    height: 28,
    width: 28,
    backgroundColor: "#141414",
    borderRadius: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});
