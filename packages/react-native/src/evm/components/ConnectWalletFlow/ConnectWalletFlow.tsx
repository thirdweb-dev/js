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
  const [activeWalletMeta, setActiveWalletMeta] = useState<WalletMeta>();

  const connect = useConnect();
  const supportedWallets = useSupportedWallets();
  const walletClasses = useWallets();
  const displayUri = useDisplayUri();

  useEffect(() => {
    if (displayUri && activeWalletMeta && modalVisible) {
      const fullUrl = formatDisplayUri(displayUri, activeWalletMeta);
      console.log("useEffect.url", fullUrl);

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
      connect(WalletConnect, {});
    } else if (wallet_.versions.includes("1")) {
      connect(WalletConnectV1, {});
    } else {
      const walletClass = walletClasses.find(
        (item) => item.id === wallet_.name,
      );
      invariant(walletClass, "Wallet class not found");
      connect(walletClass, {});
    }
  };

  return (
    <>
      <TWModal isVisible={modalVisible}>
        {activeWalletMeta ? (
          <ConnectingWallet wallet={activeWalletMeta} onClose={onClose} />
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
  connectWalletView: {
    height: "50",
    minWidth: "200px",
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
});
