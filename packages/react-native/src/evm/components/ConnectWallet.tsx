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

  /**
   * render custom rows in the Connect Wallet Details modal
   */
  extraRows?: ConnectWalletDetailsProps["extraRows"];

  /**
   * Hide the [Request Testnet Funds] button | Default to `false`
   */
  hideFaucetButton?: boolean;
} & ConnectWalletButtonProps;

export const ConnectWallet = ({
  detailsButton,
  theme,
  buttonTitle,
  modalTitle,
  extraRows,
  hideFaucetButton,
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
            extraRows={extraRows}
            hideFaucetButton={hideFaucetButton}
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
