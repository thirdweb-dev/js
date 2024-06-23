"use client";
import { useCallback, useEffect, useState } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { SiweAuthOptions } from "../../../../core/hooks/auth/useSiweAuth.js";
import { useActiveAccount } from "../../../hooks/wallets/useActiveAccount.js";
import {
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
  useSetSelectionData,
} from "../../../providers/wallet-ui-states-provider.js";
import { Modal } from "../../components/Modal.js";
import type { LocaleId } from "../../types.js";
import { onModalUnmount, reservedScreens } from "../constants.js";
import type { ConnectLocale } from "../locale/types.js";
import type { WelcomeScreen } from "../screens/types.js";
import { ConnectModalContent } from "./ConnectModalContent.js";
import { useSetupScreen } from "./screen.js";

type ConnectModalOptions = {
  onClose?: () => void;
  shouldSetActive: boolean;
  wallets: Wallet[];
  accountAbstraction: SmartWalletOptions | undefined;
  auth: SiweAuthOptions | undefined;
  onConnect: ((wallet: Wallet) => void) | undefined;
  size: "compact" | "wide";
  welcomeScreen: WelcomeScreen | undefined;
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  isEmbed: boolean;
  recommendedWallets: Wallet[] | undefined;
  localeId: LocaleId;
  chain: Chain | undefined;
  showAllWallets: boolean | undefined;
  chains: Chain[] | undefined;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
};

/**
 * @internal
 */
const ConnectModal = (props: ConnectModalOptions) => {
  const screenSetup = useSetupScreen({
    size: props.size,
    welcomeScreen: props.welcomeScreen,
    wallets: props.wallets,
  });
  const setSelectionData = useSetSelectionData();
  const { screen, setScreen, initialScreen } = screenSetup;
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const [hideModal, setHideModal] = useState(false);

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
      size={props.size}
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
        accountAbstraction={props.accountAbstraction}
        auth={props.auth}
        client={props.client}
        connectLocale={props.connectLocale}
        size={props.size}
        welcomeScreen={props.welcomeScreen}
        meta={props.meta}
        isEmbed={props.isEmbed}
        onConnect={props.onConnect}
        recommendedWallets={props.recommendedWallets}
        wallets={props.wallets}
        localeId={props.localeId}
        chain={props.chain}
        showAllWallets={props.showAllWallets}
        chains={props.chains}
        walletConnect={props.walletConnect}
      />
    </Modal>
  );
};

export default ConnectModal;
