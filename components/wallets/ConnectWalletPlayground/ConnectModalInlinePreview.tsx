import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { ConnectModalInline, Theme } from "@thirdweb-dev/react";
import React from "react";
import styles from "./ConnectModalInline.module.css";
import {
  WalletId,
  hideUIForWalletIds,
  hideUIForWalletIdsMobile,
} from "./walletInfoRecord";

export function useCanShowInlineModal(walletIds: WalletId[]) {
  const isMobile = useBreakpointValue({ base: true, md: false }, { ssr: true });

  let showInlineModal = true;

  if (walletIds.length === 1) {
    const walletId = walletIds[0];

    if (hideUIForWalletIds.has(walletId)) {
      showInlineModal = false;
    }
    if (isMobile && hideUIForWalletIdsMobile.has(walletId)) {
      showInlineModal = false;
    }
  }

  return showInlineModal;
}

export const ConnectModalInlinePreview = (props: {
  walletIds: WalletId[];
  modalTitle?: string;
  modalSize: "compact" | "wide";
  theme: Theme;
  modalTitleIconUrl?: string;
  welcomeScreen?: WelcomeScreen | (() => React.ReactNode);
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  showThirdwebBranding?: boolean;
}) => {
  const isMobile = useBreakpointValue(
    { base: true, md: false },
    { ssr: false },
  );

  return (
    <Flex
      width="full"
      justifyContent="flex-start"
      alignItems="center"
      flexDir="column"
      gap={12}
      cursor="not-allowed"
    >
      <ConnectModalInline
        modalSize={isMobile ? "compact" : props.modalSize}
        className={styles.ConnectModalInline}
        modalTitle={props.modalTitle}
        theme={props.theme}
        modalTitleIconUrl={props.modalTitleIconUrl}
        welcomeScreen={props.welcomeScreen}
        termsOfServiceUrl={props.termsOfServiceUrl}
        privacyPolicyUrl={props.privacyPolicyUrl}
        showThirdwebBranding={props.showThirdwebBranding}
      />
    </Flex>
  );
};

export type WelcomeScreen = {
  title?: string;
  subtitle?: string;
  img?: {
    src: string;
    width?: number;
    height?: number;
  };
};
