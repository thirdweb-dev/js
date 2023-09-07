import {
  ConnectWalletDetailsProps,
  WalletDetailsButton,
} from "./ConnectWalletDetails/WalletDetailsButton";
import {
  useAddress,
  useNetworkMismatch,
  useSwitchChain,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet } from "react-native";
import { ConnectWalletButton } from "./ConnectWalletFlow/ConnectWalletButton";
import { ConnectWalletButtonProps } from "./ConnectWalletFlow/ConnectWalletButton";
import BaseButton from "./base/BaseButton";
import Text from "./base/Text";
import { useUIContext } from "../providers/ui-context-provider";
import { ThemeProvider } from "../styles/ThemeProvider";

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
   * Hide option to request testnet funds for testnets in dropdown
   *
   * @default false
   */
  hideTestnetFaucet?: boolean;

  /**
   * Whether to show "Switch Network" button if the wallet is connected,
   * but it is not connected to the `activeChain` provided in `ThirdwebProvider`
   *
   * Please, note that if you support multiple networks in your app this prop should
   * be set to `false` to allow users to switch between networks.
   *
   * @default false
   */
  switchToActiveChain?: boolean;
} & ConnectWalletButtonProps;

export const ConnectWallet = ({
  detailsButton,
  theme,
  buttonTitle,
  modalTitle,
  extraRows,
  hideTestnetFaucet,
  switchToActiveChain,
}: ConnectWalletProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const address = useAddress();
  const isNetworkMismatch = useNetworkMismatch();
  const { activeChainSetExplicitly } = useWalletContext();
  const { activeChain } = useWalletContext();
  const switchChain = useSwitchChain();
  const [switching, setSwitching] = useState(false);
  const setTheme = useUIContext().setTheme;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (theme) {
      setTheme(theme);
    }
  }, [setTheme, theme]);

  return (
    <ThemeProvider theme={theme}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {address ? (
          switchToActiveChain &&
          isNetworkMismatch &&
          activeChainSetExplicitly ? (
            <BaseButton
              backgroundColor="buttonBackgroundColor"
              onPress={async () => {
                setSwitching(true);
                try {
                  await switchChain(activeChain.chainId);
                } catch {
                  // ignore
                }
                setSwitching(false);
              }}
              style={styles.connectWalletButton}
            >
              {switching ? (
                <ActivityIndicator size="small" color="buttonTextColor" />
              ) : (
                <Text variant="bodyLarge" color="buttonTextColor">
                  Switch Network
                </Text>
              )}
            </BaseButton>
          ) : (
            <WalletDetailsButton
              address={address}
              detailsButton={detailsButton}
              extraRows={extraRows}
              hideTestnetFaucet={hideTestnetFaucet}
            />
          )
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
