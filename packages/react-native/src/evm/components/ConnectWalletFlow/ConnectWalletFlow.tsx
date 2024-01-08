import Text from "../base/Text";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import { WalletConfig, useConnect, useWallets } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useState } from "react";
import { walletIds } from "@thirdweb-dev/wallets";
import { useColorScheme } from "react-native";
import {
  useGlobalTheme,
  useLocale,
  useModalState,
} from "../../providers/ui-context-provider";
import {
  CLOSE_MODAL_STATE,
  ConnectWalletFlowModal,
} from "../../utils/modalTypes";
import Box from "../base/Box";
import { ThemeProvider } from "../../styles/ThemeProvider";

export const ConnectWalletFlow = () => {
  const l = useLocale();
  const { modalState, setModalState } = useModalState();
  const {
    modalTitle,
    modalTitleIconUrl,
    privacyPolicyUrl,
    termsOfServiceUrl,
    walletConfig,
  } = (modalState as ConnectWalletFlowModal).data;
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletConfig | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectionData, setSelectionData] = useState<any>();
  const supportedWallets = useWallets();
  const theme = useColorScheme();
  const appTheme = useGlobalTheme();
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
      setSelectionData(data);
      setActiveWallet(wallet);

      // If the wallet has no custom connect UI, then connect it
      if (!wallet.connectUI) {
        connectActiveWallet(wallet, data);
      }
    },
    [connectActiveWallet],
  );

  useEffect(() => {
    // case when only one wallet is passed in supportedWallets
    if (walletConfig) {
      // if there's a selection UI, then continue with the flow
      if (walletConfig.selectUI) {
        return;
      }

      if (walletConfig.connectUI) {
        // if there's a connection UI and no selection UI, then show it
        setActiveWallet(walletConfig);
        return;
      }

      // if there's no connection UI or selectionUI, then automatically select it
      onChooseWallet(walletConfig);
    }
  }, [onChooseWallet, walletConfig]);

  const onOpenModal = () => {
    setModalVisible(true);
  };

  const onBackPress = useCallback(() => {
    resetModal();
  }, []);

  const resetModal = () => {
    setActiveWallet(undefined);
    setIsConnecting(false);
  };

  const handleClose = useCallback(() => {
    onClose(true);
  }, [onClose]);

  const getComponentForWallet = useCallback(() => {
    if (activeWallet?.connectUI) {
      return (
        <activeWallet.connectUI
          modalSize="compact"
          theme={theme || "dark"}
          goBack={onBackPress}
          connected={handleClose}
          isOpen={modalVisible}
          show={onOpenModal}
          hide={handleClose}
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
                  <Text variant="bodySmallSecondary" mt="md" textAlign="center">
                    {l.connecting_wallet.creating_encrypting}
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
            modalTitleIconUrl={modalTitleIconUrl}
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
