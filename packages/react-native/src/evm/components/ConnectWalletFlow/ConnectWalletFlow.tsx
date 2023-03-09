import { WalletMeta } from "../../types/walletMeta";
import { getWalletsMeta } from "../../utils/wallets";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { TWModal } from "../base/modal/TWModal";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import { useConnect, useWallets } from "@thirdweb-dev/react-core";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import invariant from "tiny-invariant";

export const ConnectWalletFlow = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWalletMeta, setActiveWalletMeta] = useState<
    WalletMeta | undefined
  >();

  const connect = useConnect();
  const supportedWallets = useWallets();
  const walletClasses = useWallets();

  const onConnectPress = () => {
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    setActiveWalletMeta(undefined);
  };

  const onChooseWallet = (wallet_: WalletMeta) => {
    setActiveWalletMeta(wallet_);

    let walletClass;
    if (wallet_.versions.includes("2")) {
      console.log("walletMeta.id", wallet_.id);
      // default to v2
      walletClass = supportedWallets.find((wallet) => {
        console.log("wallet.name", wallet.name);
        return wallet.name.toLowerCase().includes(wallet_.id.toLowerCase());
      });
      invariant(walletClass, "Wallet class not found");
    } else if (wallet_.versions.includes("1")) {
      walletClass = supportedWallets.find((wallet) => {
        return wallet.name.toLowerCase().includes(wallet_.id.toLowerCase());
      });
      invariant(walletClass, "Wallet class not found");
    } else {
      walletClass = walletClasses.find((item) => {
        return item.id.toLowerCase().includes(wallet_.id.toLowerCase());
      });
      invariant(walletClass, "Wallet class not found");
    }
    connect(walletClass, {});
    // .catch((error) => {
    //   console.log("error", error);
    //   onBackPress();
    // });
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
            footer={<></>}
            onClose={onClose}
          />
        )}
      </TWModal>

      <BaseButton
        backgroundColor="white"
        onPress={onConnectPress}
        style={styles.connectWalletButton}
      >
        <Text variant="bodyLarge" color="black">
          Connect Wallet
        </Text>
      </BaseButton>
    </>
  );
};

const styles = StyleSheet.create({
  connectWalletButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
