import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { TWModal } from "../base/modal/TWModal";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import { Wallet, useConnect, useWallets } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { DeviceWalletFlow } from "./DeviceWalletFlow";
import { DeviceWallet } from "../../wallets/wallets/device-wallet";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { SmartContractModal } from "./SmartContractWallet/SmartContractModal";

export const ConnectWalletFlow = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useConnect();
  const supportedWallets = useWallets();

  const onConnectPress = () => {
    if (supportedWallets.length === 1) {
      onChooseWallet(supportedWallets[0]);
    }

    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    setActiveWallet(undefined);
  };

  const connectActiveWallet = async (wallet: Wallet) => {
    setIsConnecting(true);
    connect(wallet, {}).catch((error) => {
      console.error("Error connecting to the wallet", error);
      onBackPress();
    });
  };

  const onChooseWallet = (wallet: Wallet) => {
    setActiveWallet(() => wallet);

    if (wallet.id !== DeviceWallet.id && wallet.id !== SmartWallet.id) {
      connectActiveWallet(wallet);
    }
  };

  const onBackPress = () => {
    setActiveWallet(undefined);
    setIsConnecting(false);
  };

  function getComponentForWallet(activeWalletP: Wallet) {
    console.log("activeWalletP", activeWalletP);
    switch (activeWalletP.id) {
      case DeviceWallet.id:
        return (
          <DeviceWalletFlow
            onClose={onClose}
            onBackPress={onBackPress}
            onConnectPress={() => connectActiveWallet(activeWalletP)}
          />
        );
      case SmartWallet.id:
        return (
          <SmartContractModal
            onClose={() => {
              onClose();
            }}
            onBackPress={() => {
              setActiveWallet(undefined);
            }}
          />
        );
    }
  }

  return (
    <>
      <TWModal isVisible={modalVisible}>
        {activeWallet ? (
          isConnecting ? (
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
            getComponentForWallet(activeWallet)
          )
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
        backgroundColor="buttonBackgroundColor"
        onPress={onConnectPress}
        style={styles.connectWalletButton}
      >
        <Text variant="bodyLarge" color="buttonTextColor">
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
