import { ThemeProvider, ThemeProviderProps } from "../styles/ThemeProvider";
import { ConnectWalletDetails } from "./ConnectWalletDetails/ConnectWalletDetails";
import {
  useAddress,
  useConnectionStatus,
  useWallets,
} from "@thirdweb-dev/react-core";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet } from "react-native";
import BaseButton from "./base/BaseButton";
import Text from "./base/Text";
import { useModalState } from "../providers/ui-context-provider";

export type ConnectWalletProps = {
  theme?: ThemeProviderProps["theme"];
  /**
   * Set a custom title for the button
   * @default "Connect Wallet"
   */
  buttonTitle?: string;
  /**
   * Set a custom title for the Connect Wallet modal
   * @default "Choose your wallet"
   */
  modalTitle?: string;
  /**
   * render a custom button to display the connected wallet details instead of the default button
   */
  detailsButton?: React.ReactElement;
};

export const ConnectWallet = ({
  buttonTitle,
  detailsButton,
  modalTitle,
  theme,
}: ConnectWalletProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const supportedWallets = useWallets();
  const isWalletConnecting = connectionStatus === "connecting";
  const [showButtonSpinner, setShowButtonSpinner] = useState(false);
  const { setModalState } = useModalState();

  console.log("address", address);

  useEffect(() => {
    setShowButtonSpinner(isWalletConnecting);

    if (!isWalletConnecting) {
      return;
    }

    const timeout = setTimeout(() => {
      if (isWalletConnecting) {
        setShowButtonSpinner(false);
      }
    }, 3000);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isWalletConnecting]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onConnectWalletPress = () => {
    setModalState({
      isOpen: true,
      isSheet: true,
      view: "ConnectWalletFlow",
      data: {
        modalTitle,
        walletConfig:
          supportedWallets.length === 1 ? supportedWallets[0] : undefined,
      },
      caller: "ConnectWallet",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {address ? (
          <ConnectWalletDetails
            address={address}
            detailsButton={detailsButton}
          />
        ) : (
          <BaseButton
            backgroundColor="buttonBackgroundColor"
            onPress={onConnectWalletPress}
            style={styles.connectWalletButton}
          >
            <Text variant="bodyLarge" color="buttonTextColor">
              {showButtonSpinner ? (
                <ActivityIndicator size="small" color="buttonTextColor" />
              ) : buttonTitle ? (
                buttonTitle
              ) : (
                "Connect Wallet"
              )}
            </Text>
          </BaseButton>
        )}
      </Animated.View>
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
