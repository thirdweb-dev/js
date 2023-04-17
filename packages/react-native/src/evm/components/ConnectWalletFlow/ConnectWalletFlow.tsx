import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { TWModal } from "../base/modal/TWModal";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import { Wallet, useConnect, useWallets } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { StyleSheet } from "react-native";

export const ConnectWalletFlow = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>();

  const connect = useConnect();
  const supportedWallets = useWallets();

  const onConnectPress = () => {
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    setActiveWallet(undefined);
  };

  const onChooseWallet = async (wallet: Wallet) => {
    setActiveWallet(() => wallet);

    await connect(wallet, {}).catch((error) => {
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
        backgroundColor="buttonActiveBackground"
        onPress={onConnectPress}
        style={styles.connectWalletButton}
      >
        <Text variant="bodyLarge" color="buttonActiveBackground">
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
