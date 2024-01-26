import { ActivityIndicator, StyleSheet } from "react-native";
import { BaseButton, Text } from "../base";
import { useConnectionStatus } from "@thirdweb-dev/react-core";
import { useState, useEffect } from "react";
import {
  useGlobalTheme,
  useLocale,
  useModalState,
} from "../../providers/ui-context-provider";
import { ThemeProvider, ThemeProviderProps } from "../../styles/ThemeProvider";

export type ConnectWalletButtonProps = {
  theme?: ThemeProviderProps["theme"];
  /**
   * Set a custom title for the button
   *
   * The default is `"Connect Wallet"`
   */
  buttonTitle?: string;
  /**
   * Set a custom title for the Connect Wallet modal
   *
   * The default is `"Choose your wallet"`
   */
  modalTitle?: string;
  /**
   * Replace the thirdweb icon next to modalTitle and set your own iconUrl
   *
   * Set to empty string to hide the icon
   */
  modalTitleIconUrl?: string;
  /**
   * Set a custom terms of service url
   */
  termsOfServiceUrl?: string;

  /**
   * Set a custom privacy policy url
   */
  privacyPolicyUrl?: string;
};

export const ConnectWalletButton = ({
  modalTitle,
  modalTitleIconUrl,
  termsOfServiceUrl,
  privacyPolicyUrl,
  buttonTitle,
  theme,
}: ConnectWalletButtonProps) => {
  const l = useLocale();
  const appTheme = useGlobalTheme();
  const connectionStatus = useConnectionStatus();
  const isWalletConnecting = connectionStatus === "connecting";

  const [showButtonSpinner, setShowButtonSpinner] = useState(false);
  const { setModalState } = useModalState();

  useEffect(() => {
    setShowButtonSpinner(isWalletConnecting);

    if (!isWalletConnecting) {
      setShowButtonSpinner(false);
      return;
    }

    const timeout = setTimeout(() => {
      if (isWalletConnecting) {
        setShowButtonSpinner(false);
      }
    }, 5000);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isWalletConnecting]);

  const onConnectWalletPress = () => {
    setModalState({
      isOpen: true,
      isSheet: true,
      view: "ConnectWalletFlow",
      data: {
        modalTitle,
        modalTitleIconUrl,
        termsOfServiceUrl,
        privacyPolicyUrl,
      },
      caller: "ConnectWallet",
    });
  };

  return (
    <ThemeProvider theme={theme ? theme : appTheme}>
      <BaseButton
        backgroundColor="buttonBackgroundColor"
        borderColor="buttonBorderColor"
        borderWidth={1}
        onPress={onConnectWalletPress}
        style={styles.connectWalletButton}
      >
        <Text variant="bodyLargeBold" color="buttonTextColor">
          {showButtonSpinner ? (
            <ActivityIndicator
              size="small"
              color={appTheme.colors.buttonTextColor}
            />
          ) : buttonTitle ? (
            buttonTitle
          ) : (
            l.connect_wallet.label
          )}
        </Text>
      </BaseButton>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  connectWalletButton: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minWidth: 150,
  },
});
