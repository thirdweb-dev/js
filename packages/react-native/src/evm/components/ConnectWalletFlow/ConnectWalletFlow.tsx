import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { TWModal } from "../base/modal/TWModal";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import {
  ConfiguredWallet,
  WalletInstance,
  useConnect,
  useIsConnecting,
  useThirdwebWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { SmartWalletFlow } from "./SmartWallet/SmartWalletFlow";
import { LocalWallet } from "../../wallets/wallets/local-wallet";
import { useIsConnectModalVisible } from "../../providers/context-provider";

export const ConnectWalletFlow = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<
    ConfiguredWallet | undefined
  >();
  const [isConnecting, setIsConnecting] = useState(false);
  const supportedWallets = useWallets();
  const isWalletConnecting = useIsConnecting();
  const [showButtonSpinner, setShowButtonSpinner] = useState(false);
  const handleWalletConnect = useThirdwebWallet().handleWalletConnect;

  const { setIsConnectModalVisible } = useIsConnectModalVisible();

  useEffect(() => {
    setShowButtonSpinner(isWalletConnecting);

    if (!isWalletConnecting) {
      return;
    }

    const timeout = setTimeout(() => {
      if (isWalletConnecting) {
        setShowButtonSpinner(false);
      }
    }, 3000);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isWalletConnecting]);

  const connect = useConnect();

  const onConnectPress = () => {
    if (supportedWallets.length === 1) {
      onChooseWallet(supportedWallets[0]);
    }

    setIsConnectModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    reset();
  };

  const connectActiveWallet = async (wallet: ConfiguredWallet) => {
    setIsConnecting(true);
    connect(wallet, {}).catch((error) => {
      console.error("Error connecting to the wallet", error);
      onBackPress();
    });
  };

  const onChooseWallet = (wallet: ConfiguredWallet) => {
    setActiveWallet(() => wallet);

    if (wallet.id !== SmartWallet.id) {
      connectActiveWallet(wallet);
    }
  };

  const onBackPress = () => {
    reset();
  };

  const reset = () => {
    setActiveWallet(undefined);
    setIsConnecting(false);
  };

  const handleConnect = (connectedWallet: WalletInstance) => {
    setModalVisible(false);
    handleWalletConnect(connectedWallet);
  };

  return (
    <BaseButton
      backgroundColor="buttonBackgroundColor"
      onPress={onConnectPress}
      style={styles.connectWalletButton}
    >
      <Text variant="bodyLarge" color="buttonTextColor">
        {showButtonSpinner ? (
          <ActivityIndicator size="small" color="buttonTextColor" />
        ) : (
          "Connect Wallet"
        )}
      </Text>
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  connectWalletButton: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minWidth: 150,
  },
});
