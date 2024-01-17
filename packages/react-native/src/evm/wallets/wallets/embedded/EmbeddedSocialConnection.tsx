import { useCallback, useEffect, useState } from "react";
import React from "react";
import { ActivityIndicator } from "react-native";
import { EmbeddedWallet } from "./EmbeddedWallet";
import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import { Box, Text, WalletButton } from "../../../components/base";
import { AUTH_OPTIONS_ICONS, SocialLogin } from "../../types/embedded-wallet";

export const EmbeddedSocialConnection: React.FC<
  ConnectUIProps<EmbeddedWallet>
> = ({ goBack, selectionData, setConnectedWallet, setConnectionStatus }) => {
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSocialLogin = useCallback(() => {
    setErrorMessage("");

    setTimeout(async () => {
      const embeddedWallet = selectionData.emailWallet as EmbeddedWallet;

      try {
        const authResult = await embeddedWallet.authenticate({
          strategy: selectionData.oauthOptions?.provider as SocialLogin,
          redirectUrl: selectionData.oauthOptions?.redirectUrl,
        });

        const response = await embeddedWallet.connect({ authResult });

        if (response) {
          setConnectedWallet(selectionData.emailWallet);
          setConnectionStatus("connected");
        } else {
          setErrorMessage(
            response || "Error signing in. Please try again later.",
          );
        }
      } catch (error) {
        console.error(
          `Error signing in with ${selectionData.oauthOptions?.provider}: `,
          error,
        );
        setErrorMessage(`${error}`);
      }
    }, 0);
  }, [
    selectionData.emailWallet,
    selectionData.oauthOptions?.provider,
    selectionData.oauthOptions?.redirectUrl,
    setConnectedWallet,
    setConnectionStatus,
  ]);

  useEffect(() => {
    handleSocialLogin();
  }, [handleSocialLogin]);

  return (
    <Box marginHorizontal="xl" height={200}>
      <ConnectWalletHeader
        middleContent={
          <WalletButton
            iconHeight={28}
            iconWidth={28}
            borderRadius="lg"
            justifyContent="center"
            name="Sign In"
            walletIconUrl={
              AUTH_OPTIONS_ICONS[
                selectionData.oauthOptions?.provider as SocialLogin
              ]
            }
          />
        }
        subHeaderText={""}
        onBackPress={goBack}
        onClose={goBack}
      />
      <Box flex={1} justifyContent="center" alignItems="center">
        {!errorMessage ? (
          <ActivityIndicator size="large" />
        ) : (
          <Text variant="error">{errorMessage}</Text>
        )}
      </Box>
    </Box>
  );
};
