import { ThemeProvider, ThemeProviderProps } from "../styles/ThemeProvider";
import { ConnectWalletDetails } from "./ConnectWalletDetails/ConnectWalletDetails";
import { ConnectWalletFlow } from "./ConnectWalletFlow/ConnectWalletFlow";
import { useAddress } from "@thirdweb-dev/react-core";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ThemeProvider theme={theme}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {address ? (
          <ConnectWalletDetails
            address={address}
            detailsButton={detailsButton}
          />
        ) : (
          <ConnectWalletFlow
            buttonTitle={buttonTitle}
            modalTitle={modalTitle}
          />
        )}
      </Animated.View>
    </ThemeProvider>
  );
};
