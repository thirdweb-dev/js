"use client";
import { useCallback, useEffect, useState } from "react";
import { useConnectUI } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { useActiveAccount } from "../../../hooks/wallets/useActiveAccount.js";
import {
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
  useSetSelectionData,
} from "../../../providers/wallet-ui-states-provider.js";
import { Modal } from "../../components/Modal.js";
import { onModalUnmount, reservedScreens } from "../constants.js";
import { ConnectModalContent } from "./ConnectModalContent.js";
import { useSetupScreen } from "./screen.js";

type ConnectModalOptions = {
  onClose?: () => void;
  shouldSetActive: boolean;
};

/**
 * @internal
 */
const ConnectModal = (props: ConnectModalOptions) => {
  const screenSetup = useSetupScreen();
  const setSelectionData = useSetSelectionData();
  const { screen, setScreen, initialScreen } = screenSetup;
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const [hideModal, setHideModal] = useState(false);
  const { connectModal } = useConnectUI();

  const closeModal = useCallback(() => {
    props.onClose?.();
    setIsWalletModalOpen(false);
    onModalUnmount(() => {
      setScreen(initialScreen);
      setSelectionData({});
    });
  }, [
    initialScreen,
    setIsWalletModalOpen,
    setScreen,
    setSelectionData,
    props.onClose,
  ]);

  const activeAccount = useActiveAccount();

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
    <Modal
      hide={hideModal}
      size={connectModal.size}
      open={isWalletModalOpen}
      setOpen={(value) => {
        if (hideModal) {
          return;
        }

        if (!value) {
          closeModal();
        }
      }}
    >
      <ConnectModalContent
        shouldSetActive={props.shouldSetActive}
        screenSetup={screenSetup}
        setModalVisibility={setModalVisibility}
        isOpen={isWalletModalOpen}
        onClose={closeModal}
      />
    </Modal>
  );
};

export default ConnectModal;
