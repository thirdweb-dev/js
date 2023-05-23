import Text from "../base/Text";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import { WalletConfig, useConnect, useWallets } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useState } from "react";
import { SmartWallet, walletIds } from "@thirdweb-dev/wallets";
import { SmartWalletFlow } from "./SmartWallet/SmartWalletFlow";
import { useColorScheme } from "react-native";
import { useModalState } from "../../providers/ui-context-provider";
import {
  CLOSE_MODAL_STATE,
  ConnectWalletFlowModal,
} from "../../utils/modalTypes";

export const ConnectWalletFlow = () => {
  const { modalState, setModalState } = useModalState();
  const { modalTitle, walletConfig } = (modalState as ConnectWalletFlowModal)
    .data;

  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletConfig | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const supportedWallets = useWallets();
  const theme = useColorScheme();
  const connect = useConnect();

  const onClose = useCallback(
    (reset?: boolean) => {
      setModalState(CLOSE_MODAL_STATE("ConnectWalletFlow"));

      if (reset) {
        resetModal();
      }
    },
    [setModalState],
  );

  const connectActiveWallet = useCallback(
    async (wallet: WalletConfig) => {
      setIsConnecting(true);
      connect(wallet, {})
        .catch((error) => {
          console.error("Error connecting to the wallet", error);
        })
        .finally(() => {
          onClose(true);
        });
    },
    [connect, onClose],
  );

  const onChooseWallet = useCallback(
    (wallet: WalletConfig) => {
      setActiveWallet(() => wallet);

      // TODO: Change for !wallet.connectUI
      if (wallet.id !== SmartWallet.id) {
        connectActiveWallet(wallet);
      }
    },
    [connectActiveWallet],
  );

  useEffect(() => {
    if (walletConfig) {
      onChooseWallet(walletConfig);
    }
  }, [onChooseWallet, walletConfig]);

  const onOpenModal = () => {
    setModalVisible(true);
  };

  const onBackPress = () => {
    resetModal();
  };

  const onConnected = () => {
    onClose(true);
  };

  const resetModal = () => {
    setActiveWallet(undefined);
    setIsConnecting(false);
  };

  function getComponentForWallet() {
    switch (activeWallet?.id) {
      case SmartWallet.id:
        return <SmartWalletFlow onClose={onClose} onConnect={onConnected} />;
    }

    if (activeWallet?.connectUI) {
      return (
        <activeWallet.connectUI
          theme={theme || "dark"}
          goBack={onBackPress}
          close={onClose}
          isOpen={modalVisible}
          open={onOpenModal}
          walletConfig={activeWallet}
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
          getComponentForWallet()
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
