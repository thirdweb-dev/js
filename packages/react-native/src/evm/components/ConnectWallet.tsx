import { ThemeProvider } from "../styles/ThemeProvider";
import {
  ConnectWalletDetailsProps,
  WalletDetailsButton,
} from "./ConnectWalletDetails/WalletDetailsButton";
import { useAddress } from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { ConnectWalletButton } from "./ConnectWalletFlow/ConnectWalletButton";
import { ConnectWalletButtonProps } from "./ConnectWalletFlow/ConnectWalletButton";

export type ConnectWalletProps = {
  /**
   * render a custom button to display the connected wallet details instead of the default button
   */
  detailsButton?: ConnectWalletDetailsProps["detailsButton"];
} & ConnectWalletButtonProps;

export const ConnectWallet = ({
  detailsButton,
  theme,
  buttonTitle,
  modalTitle,
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
          <WalletDetailsButton
            address={address}
            detailsButton={detailsButton}
          />
        ) : (
          <ConnectWalletButton
            modalTitle={modalTitle}
            buttonTitle={buttonTitle}
            theme={theme}
          />
        )}
      </Animated.View>
    </ThemeProvider>
  );
};
