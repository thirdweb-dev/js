import { useCallback, useContext, useEffect, useState } from "react";
import { useActiveAccount } from "../../../../core/hooks/wallets/wallet-hooks.js";
import {
  ModalConfigCtx,
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "../../../providers/wallet-ui-states-provider.js";
import { Modal } from "../../components/Modal.js";
import { CustomThemeProvider } from "../../design-system/CustomThemeProvider.js";
import { onModalUnmount, reservedScreens } from "../constants.js";
import { ConnectModalContent } from "./ConnectModalContent.js";
import { useSetupScreen } from "./screen.js";

/**
 * @internal
 */
const ConnectModal = () => {
  const { theme, modalSize } = useContext(ModalConfigCtx);

  const screenSetup = useSetupScreen();
  const { screen, setScreen, initialScreen } = screenSetup;
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const [hideModal, setHideModal] = useState(false);
  // const connectionStatus = useConnectionStatus();

  const closeModal = useCallback(() => {
    setIsWalletModalOpen(false);
    onModalUnmount(() => {
      setScreen(initialScreen);
    });
  }, [initialScreen, setIsWalletModalOpen, setScreen]);

  // const [prevConnectionStatus, setPrevConnectionStatus] =
  //   useState(connectionStatus);

  // useEffect(() => {
  //   setPrevConnectionStatus(connectionStatus);
  // }, [connectionStatus]);

  // const disconnect = useDisconnect();

  const activeAccount = useActiveAccount();
  // const isWrapperConnected = !!wallet?.getPersonalWallet();

  // const isWrapperScreen =
  //   typeof screen !== "string" && !!screen.personalWallets;

  // reopen the screen to complete wrapper wallet's next step after connecting a personal wallet
  // useEffect(() => {
  //   if (
  //     // !isWrapperConnected &&
  //     isWrapperScreen &&
  //     !isWalletModalOpen &&
  //     // connectionStatus === "connected" &&
  //     // prevConnectionStatus === "connecting"
  //   ) {
  //     setIsWalletModalOpen(true);
  //   }
  // }, [
  //   isWalletModalOpen,
  //   connectionStatus,
  //   setIsWalletModalOpen,
  //   isWrapperScreen,
  //   // isWrapperConnected,
  //   prevConnectionStatus,
  // ]);

  useEffect(() => {
    if (!isWalletModalOpen) {
      onModalUnmount(() => {
        setHideModal(false);
      });
    }
  }, [isWalletModalOpen]);

  const setModalVisibility = useCallback(
    (value: boolean) => setHideModal(!value),
    [],
  );

  // if wallet is suddenly disconnected when showing the sign in screen, close the modal and reset the screen
  useEffect(() => {
    if (
      isWalletModalOpen &&
      screen === reservedScreens.signIn &&
      !activeAccount
    ) {
      setScreen(initialScreen);
      setIsWalletModalOpen(false);
    }
  }, [
    initialScreen,
    isWalletModalOpen,
    screen,
    setIsWalletModalOpen,
    setScreen,
    activeAccount,
  ]);

  return (
    <CustomThemeProvider theme={theme}>
      <Modal
        hide={hideModal}
        size={modalSize}
        open={isWalletModalOpen}
        setOpen={(value) => {
          if (hideModal) {
            return;
          }

          setIsWalletModalOpen(value);

          if (!value) {
            onModalUnmount(() => {
              // if (connectionStatus === "connecting") {
              //   disconnect();
              // }

              setScreen(initialScreen);
            });
          }
        }}
      >
        <ConnectModalContent
          screenSetup={screenSetup}
          setModalVisibility={setModalVisibility}
          isOpen={isWalletModalOpen}
          onClose={closeModal}
        />
      </Modal>
    </CustomThemeProvider>
  );
};

export default ConnectModal;
