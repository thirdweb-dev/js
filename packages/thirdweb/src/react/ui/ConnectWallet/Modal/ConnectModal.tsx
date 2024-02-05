import {
  ModalConfigCtx,
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "../../../providers/wallet-ui-states-provider.js";
import { useCallback, useEffect, useContext, useState } from "react";
import { reservedScreens, onModalUnmount } from "../constants.js";
import { useScreen } from "./screen.js";
import { CustomThemeProvider } from "../../design-system/CustomThemeProvider.js";
import { useActiveWallet } from "../../../providers/wallet-provider.js";
import { Modal } from "../../components/Modal.js";
import { ConnectModalContent } from "./ConnectModalContent.js";

/**
 * @internal
 */
export const ConnectModal = () => {
  const { theme, modalSize, chainId } = useContext(ModalConfigCtx);

  const { screen, setScreen, initialScreen } = useScreen();
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

  const wallet = useActiveWallet();
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
  }, [isWalletModalOpen, setIsWalletModalOpen, screen]);

  const onHide = useCallback(() => setHideModal(true), []);
  const onShow = useCallback(() => setHideModal(false), []);

  // if wallet is suddenly disconnected when showing the sign in screen, close the modal and reset the screen
  useEffect(() => {
    if (isWalletModalOpen && screen === reservedScreens.signIn && !wallet) {
      setScreen(initialScreen);
      setIsWalletModalOpen(false);
    }
  }, [
    initialScreen,
    isWalletModalOpen,
    screen,
    setIsWalletModalOpen,
    setScreen,
    wallet,
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
          initialScreen={initialScreen}
          screen={screen}
          setScreen={setScreen}
          onHide={onHide}
          onShow={onShow}
          isOpen={isWalletModalOpen}
          onClose={closeModal}
          chainId={chainId}
        />
      </Modal>
    </CustomThemeProvider>
  );
};

export default ConnectModal;
