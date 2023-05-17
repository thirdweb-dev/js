import Text from "../base/Text";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import { WalletConfig, useConnect, useWallets } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { SmartWallet, walletIds } from "@thirdweb-dev/wallets";
import { SmartWalletFlow } from "./SmartWallet/SmartWalletFlow";
import { useColorScheme } from "react-native";
import { useModalState } from "../../providers/ui-context-provider";
import { ConnectWalletFlowModal } from "../../utils/modalTypes";

export const ConnectWalletFlow = () => {
  const { modalState } = useModalState();
  const { modalTitle } = (modalState as ConnectWalletFlowModal).data;

  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletConfig | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const supportedWallets = useWallets();
  const theme = useColorScheme();
  const connect = useConnect();

  // const onConnectPress = () => {
  //   if (supportedWallets.length === 1) {
  //     onChooseWallet(supportedWallets[0]);
  //   }

  //   setModalVisible(true);
  // };

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
          supportedWallets={supportedWallets}
          selectionData={undefined} // TODO
          setSelectionData={() => {}} // TODO
        />
      );
    }
  }

  return (
    <>
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
    </>
  );
};
