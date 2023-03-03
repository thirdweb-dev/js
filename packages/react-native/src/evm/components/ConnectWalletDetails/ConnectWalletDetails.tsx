import { useActiveWalletMeta } from "../../contexts/wallets-context";
import { NetworkSelectorModal } from "../NetworkSelector/NetworkSelectorModal";
import { Address } from "../base/Address";
import { ChainIcon } from "../base/ChainIcon";
import { WalletIcon } from "../base/WalletIcon";
import { WalletDetailsModal } from "./WalletDetailsModal";
import {
  useActiveWallet,
  useBalance,
  useDisconnect,
} from "@thirdweb-dev/react-core";
import { useActiveChain } from "@thirdweb-dev/react-core/evm";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Linking,
  View,
  Text,
} from "react-native";

export type ConnectWalletDetailsProps = {
  address: string;
};

export const ConnectWalletDetails = ({
  address,
}: ConnectWalletDetailsProps) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isNetworkSelectorModalVisible, setIsNetworkSelectorModalVisible] =
    useState(false);

  const activeWallet = useActiveWallet();
  const activeWalletMeta = useActiveWalletMeta();
  const disconnect = useDisconnect();
  const chain = useActiveChain();
  const balanceQuery = useBalance();

  useEffect(() => {
    console.log("listen to open wallet", activeWalletMeta);
    if (activeWallet?.walletId.includes("walletConnect")) {
      activeWallet.on("open_wallet", (uri?: string) => {
        console.log("open_wallet", uri);
        console.log(
          "open_wallet.universal",
          activeWalletMeta?.mobile.universal,
          uri,
        );
        if (!uri && activeWalletMeta?.mobile.universal) {
          console.log(
            "open_wallet.universal",
            activeWalletMeta?.mobile.universal,
          );
          Linking.openURL(activeWalletMeta?.mobile.universal);
        }
      });
    }

    return () => {
      console.log("unlisten to open wallet");
      if (activeWallet?.walletId.includes("walletConnect")) {
        activeWallet.off("open_wallet");
      }
    };
  }, [activeWallet, activeWalletMeta, activeWalletMeta?.mobile.universal]);

  const onPress = () => {
    setIsDetailsModalVisible(true);
  };

  const onDisconnectPress = () => {
    disconnect();
  };

  const onChangeNetworkPress = () => {
    // setIsDetailsModalVisible(false);
    // setIsNetworkSelectorModalVisible(true);
  };

  const onSelectorModalClose = () => {
    setIsNetworkSelectorModalVisible(false);
  };

  const onBackdropPress = () => {
    setIsDetailsModalVisible(false);
  };

  return (
    <>
      <WalletDetailsModal
        onBackdropPress={onBackdropPress}
        onDisconnectPress={onDisconnectPress}
        address={address}
        onChangeNetworkPress={onChangeNetworkPress}
        isVisible={isDetailsModalVisible}
      />

      <NetworkSelectorModal
        isVisible={isNetworkSelectorModalVisible}
        onClose={onSelectorModalClose}
      />
      <TouchableOpacity style={styles.walletDetails} onPress={onPress}>
        <ChainIcon size={32} chainIconUrl={chain?.icon?.url} />
        <View style={styles.walletInfo}>
          <Text style={styles.balance}>
            {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
            {balanceQuery.data?.symbol}
          </Text>
          <Address style={styles.address} address={address} />
        </View>
        <WalletIcon size={32} iconUri={activeWalletMeta?.image_url || ""} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  address: {
    color: "#646D7A",
    textAlign: "left",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 16,
  },
  walletInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "center",
    flexDirection: "column",
    marginLeft: 5,
  },
  balance: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 16,
    color: "#F1F1F1",
  },
  text: {
    color: "#F1F1F1",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
  },
  walletDetails: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#131417",
    borderRadius: 12,
    borderColor: "#646D7A",
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    minWidth: 200,
  },
});
