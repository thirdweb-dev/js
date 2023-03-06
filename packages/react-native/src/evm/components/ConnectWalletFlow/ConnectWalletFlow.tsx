import { useSupportedWallets } from "../../contexts/wallets-context";
import { WalletMeta } from "../../types/wallet";
import { formatDisplayUri } from "../../utils/uri";
import { getWalletsMeta } from "../../utils/wallets";
import { TWModal } from "../base/modal/TWModal";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import {
  useConnect,
  useDisplayUri,
  useWallets,
} from "@thirdweb-dev/react-core";
import { WalletConnect, WalletConnectV1 } from "@thirdweb-dev/wallets";
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import invariant from "tiny-invariant";

export const ConnectWalletFlow = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWalletMeta, setActiveWalletMeta] = useState<
    WalletMeta | undefined
  >();

  const connect = useConnect();
  const supportedWallets = useSupportedWallets();
  const walletClasses = useWallets();
  const displayUri = useDisplayUri();

  useEffect(() => {
    if (displayUri && activeWalletMeta && modalVisible) {
      const fullUrl = formatDisplayUri(displayUri, activeWalletMeta);

      Linking.openURL(fullUrl);
    }
  }, [activeWalletMeta, displayUri, modalVisible]);

  const onConnectPress = () => {
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    setActiveWalletMeta(undefined);
  };

  const onChooseWallet = (wallet_: WalletMeta) => {
    setActiveWalletMeta(wallet_);

    if (wallet_.versions.includes("2")) {
      // default to v2
      const walletClass = walletClasses.find((w) => w.id === WalletConnect.id);
      invariant(walletClass, "Wallet class not found");
      connect(walletClass, {});
    } else if (wallet_.versions.includes("1")) {
      const walletClass = walletClasses.find(
        (w) => w.id === WalletConnectV1.id,
      );
      invariant(walletClass, "Wallet class not found");
      connect(walletClass, {});
    } else {
      const walletClass = walletClasses.find((item) => {
        return item.id.toLowerCase().includes(wallet_.id.toLowerCase());
      });
      invariant(walletClass, "Wallet class not found");
      connect(walletClass, {});
    }
  };

  const onBackPress = () => {
    setActiveWalletMeta(undefined);
  };

  return (
    <>
      <TWModal isVisible={modalVisible}>
        {activeWalletMeta ? (
          <ConnectingWallet
            wallet={activeWalletMeta}
            onClose={onClose}
            onBackPress={onBackPress}
          />
        ) : (
          <ChooseWallet
            wallets={getWalletsMeta(supportedWallets)}
            onChooseWallet={onChooseWallet}
            onClose={onClose}
          />
        )}
      </TWModal>

      <TouchableOpacity
        style={styles.connectWalletButton}
        onPress={onConnectPress}
      >
        <Text style={styles.darkText}>Connect Wallet</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  darkText: {
    color: "black",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  connectWalletButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
