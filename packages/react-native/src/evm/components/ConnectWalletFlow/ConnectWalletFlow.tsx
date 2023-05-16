import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { TWModal } from "../base/modal/TWModal";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import {
  WalletConfig,
  useConnect,
  useConnectionStatus,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SmartWallet, walletIds } from "@thirdweb-dev/wallets";
import { SmartWalletFlow } from "./SmartWallet/SmartWalletFlow";
import { useColorScheme } from "react-native";

export const ConnectWalletFlow = ({
  buttonTitle,
  modalTitle,
}: {
  buttonTitle?: string;
  modalTitle?: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletConfig | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const supportedWallets = useWallets();
  const connectionStatus = useConnectionStatus();
  const isWalletConnecting = connectionStatus === "connecting";
  const [showButtonSpinner, setShowButtonSpinner] = useState(false);
  const theme = useColorScheme();

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

    setModalVisible(true);
  };

  const onClose = (reset?: boolean) => {
    setModalVisible(false);

    if (reset) {
      resetModal();
    }
  };

  const onOpenModal = () => {
    setModalVisible(true);
  };

  const connectActiveWallet = async (wallet: WalletConfig) => {
    setIsConnecting(true);
    connect(wallet, {}).catch((error) => {
      console.error("Error connecting to the wallet", error);
      onBackPress();
    });
  };

  const onChooseWallet = (wallet: WalletConfig) => {
    setActiveWallet(() => wallet);

    if (wallet.id !== SmartWallet.id) {
      connectActiveWallet(wallet);
    }
  };

  const onBackPress = () => {
    resetModal();
  };

  const resetModal = () => {
    setActiveWallet(undefined);
    setIsConnecting(false);
  };

  function getComponentForWallet(activeWalletP: WalletConfig) {
    switch (activeWalletP.id) {
      case SmartWallet.id:
        return <SmartWalletFlow onClose={onClose} onConnect={onBackPress} />;
    }

    if (activeWalletP.connectUI) {
      return (
        <activeWalletP.connectUI
          theme={theme || "dark"}
          goBack={onBackPress}
          close={onClose}
          isOpen={modalVisible}
          open={onOpenModal}
          walletConfig={activeWalletP}
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
                activeWallet.id === walletIds.localWallet ? (
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
            headerText={modalTitle}
            wallets={supportedWallets}
            onChooseWallet={onChooseWallet}
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
          {showButtonSpinner ? (
            <ActivityIndicator size="small" color="buttonTextColor" />
          ) : buttonTitle ? (
            buttonTitle
          ) : (
            "Connect Wallet"
          )}
        </Text>
      </BaseButton>
    </>
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
