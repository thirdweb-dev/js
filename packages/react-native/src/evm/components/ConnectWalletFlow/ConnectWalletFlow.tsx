import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { TWModal } from "../base/modal/TWModal";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import { DeviceWallet } from "../../wallets/wallets/device-wallet";
import { Wallet, useConnect, useWallets } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { Linking, StyleSheet } from "react-native";
import { handleResponse } from "@coinbase/wallet-mobile-sdk";

export const ConnectWalletFlow = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>();

  const connect = useConnect();
  const supportedWallets = useWallets();

  useEffect(() => {
    if (activeWallet && activeWallet.meta.name.toLowerCase().includes("coinbase")) {
      const sub = Linking.addEventListener("url", ({ url }) => {
        if (url) {
          handleResponse(new URL(url));
        }
      });
      return () => sub?.remove();
    }
  }, [activeWallet]);

  const onConnectPress = () => {
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    setActiveWallet(undefined);
  };

  const onChooseWallet = async (wallet: Wallet) => {
    setActiveWallet(() => wallet);

    connect(wallet, {}).catch((error) => {
      console.log("error", error);
      onBackPress();
    });
  };

  const onBackPress = () => {
    setActiveWallet(undefined);
  };

  return (
    <>
      <TWModal isVisible={modalVisible}>
        {activeWallet ? (
          <ConnectingWallet
            content={
              activeWallet.id === DeviceWallet.id ? (
                <Text variant="bodySmallSecondary" mt="md">
                  Creating, encrypting and securing your device wallet.
                </Text>
              ) : undefined
            }
            wallet={activeWallet}
            onClose={onClose}
            onBackPress={onBackPress}
          />
        ) : (
          <ChooseWallet
            wallets={supportedWallets}
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
