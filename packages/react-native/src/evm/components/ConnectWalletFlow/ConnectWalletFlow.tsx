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
import Box from "../base/Box";
import { ThemeProvider } from "../../styles/ThemeProvider";
import { useAppTheme } from "../../styles/hooks";

export const ConnectWalletFlow = () => {
  const { modalState, setModalState } = useModalState();
  const { modalTitle, privacyPolicyUrl, termsOfServiceUrl, walletConfig } = (
    modalState as ConnectWalletFlowModal
  ).data;

  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletConfig | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectionData, setSelectionData] = useState<any>();
  const supportedWallets = useWallets();
  const theme = useColorScheme();
  const appTheme = useAppTheme();
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
    async (wallet: WalletConfig, data?: any) => {
      setIsConnecting(true);
      try {
        await connect(wallet, { ...data });
      } catch (error) {
        console.error("Error connecting to the wallet", error);
      } finally {
        onClose(true);
      }
    },
    [connect, onClose],
  );

  const onChooseWallet = useCallback(
    (wallet: WalletConfig, data?: any) => {
      setActiveWallet(() => wallet);
      setSelectionData(data);

      // If not smart wallet (sw has it's own flow, need to migrate it to connectUI)
      // &&
      // If the wallet has no custom connect UI, then connect it
      if (wallet.id !== SmartWallet.id && !wallet.connectUI) {
        connectActiveWallet(wallet, data);
      }
    },
    [connectActiveWallet],
  );

  useEffect(() => {
    // case when only one wallet is passed in supportedWallets
    if (walletConfig && !walletConfig.connectUI) {
      onChooseWallet(walletConfig);
    }
  }, [onChooseWallet, walletConfig]);

  const onOpenModal = () => {
    setModalVisible(true);
  };

  const onBackPress = useCallback(() => {
    resetModal();
  }, []);

  const onConnected = useCallback(() => {
    onClose(true);
  }, [onClose]);

  const resetModal = () => {
    setActiveWallet(undefined);
    setIsConnecting(false);
  };

  const handleClose = useCallback(() => {
    onClose(true);
  }, [onClose]);

  const getComponentForWallet = useCallback(() => {
    switch (activeWallet?.id) {
      case SmartWallet.id:
        return <SmartWalletFlow onClose={onClose} onConnect={onConnected} />;
    }

    if (activeWallet?.connectUI) {
      return (
        <activeWallet.connectUI
          modalSize="compact"
          theme={theme || "dark"}
          goBack={onBackPress}
          close={handleClose}
          isOpen={modalVisible}
          open={onOpenModal}
          walletConfig={activeWallet}
          supportedWallets={supportedWallets}
          selectionData={selectionData}
          setSelectionData={() => {}} // TODO
        />
      );
    }
  }, [
    activeWallet,
    handleClose,
    modalVisible,
    onBackPress,
    onClose,
    onConnected,
    selectionData,
    supportedWallets,
    theme,
  ]);

  return (
    <ThemeProvider theme={appTheme}>
      <Box flexDirection="column">
        {activeWallet ? (
          isConnecting ? (
            <ConnectingWallet
              subHeaderText=""
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
            privacyPolicyUrl={privacyPolicyUrl}
            termsOfServiceUrl={termsOfServiceUrl}
            wallets={supportedWallets}
            onChooseWallet={onChooseWallet}
            onClose={onClose}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};
