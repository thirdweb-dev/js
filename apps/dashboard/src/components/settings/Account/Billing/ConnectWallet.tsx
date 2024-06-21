import { ConnectWalletWelcomeScreen } from "@3rdweb-sdk/react/components/connect-wallet";
import { useColorMode } from "@chakra-ui/react";
import {
  useSetIsWalletModalOpen,
  useSetWalletModalConfig,
} from "@thirdweb-dev/react";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { useEffect, useRef } from "react";

export const BillingConnectWalletPrompt = () => {
  const { colorMode } = useColorMode();
  const modalOpened = useRef(false);
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const setModalConfig = useSetWalletModalConfig();

  // will be removed as part of: https://github.com/thirdweb-dev/dashboard/pull/2648 - we then can just make a specific button with its own props for it
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // trigger button
    if (!modalOpened.current) {
      setModalConfig({
        modalSize: "wide",
        termsOfServiceUrl: "/tos",
        privacyPolicyUrl: "/privacy",
        welcomeScreen: () => (
          <ConnectWalletWelcomeScreen
            theme={colorMode}
            subtitle="Connect a wallet to claim your 1 month free trial"
          />
        ),
      });
      setIsWalletModalOpen(true);

      modalOpened.current = true;
    }
  }, [colorMode, setIsWalletModalOpen, setModalConfig]);

  return <ConnectWalletPrompt />;
};
