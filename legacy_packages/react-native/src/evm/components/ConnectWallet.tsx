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
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet } from "react-native";
import { ConnectWalletButton } from "./ConnectWalletFlow/ConnectWalletButton";
import { ConnectWalletButtonProps } from "./ConnectWalletFlow/ConnectWalletButton";
import BaseButton from "./base/BaseButton";
import Text from "./base/Text";
import {
  useGlobalTheme,
  useLocale,
  useUIContext,
} from "../providers/ui-context-provider";
import { ThemeProvider } from "../styles/ThemeProvider";
import { SupportedTokens, defaultTokens } from "./SendFunds/defaultTokens";

export type ConnectWalletProps = {
  /**
   * Renders a custom button to display the connected wallet details instead of the default button
   */
  detailsButton?: ConnectWalletDetailsProps["detailsButton"];

  /**
   * Renders custom rows in the Connect Wallet Details modal
   */
  extraRows?: ConnectWalletDetailsProps["extraRows"];

  /**
   * Option to hide the Send button in the wallet details modal.
   *
   * The default is `false`
   */
  hideSendButton?: boolean;

  /**
   * Option to hide the Receive button in the wallet details modal.
   *
   * The default is `false`
   */
  hideReceiveButton?: boolean;

  /**
   * Hide option to request testnet funds for testnets in dropdown
   *
   * By default it is `true`, If you want to show the "Request Testnet funds" link when user is connected to a testnet, set this prop to `false`
   *
   * @example
   * ```tsx
   * <ConnectWallet hideTestnetFaucet={false} />
   * ```
   */
  hideTestnetFaucet?: boolean;

  /**
   * Whether to show "Switch Network" button if the wallet is connected,
   * but it is not connected to the `activeChain` provided in [`ThirdwebProvider`](https://portal.thirdweb.com/react-native/v0/ThirdwebProvider)
   *
   * Please, note that if you support multiple networks in your app this prop should
   * be set to `false` to allow users to switch between networks.
   *
   * The default is `false`
   */
  switchToActiveChain?: boolean;

  /**
   * Override the default supported tokens for each network
   *
   * These tokens will be displayed in "Send Funds" Modal
   */
  supportedTokens?: SupportedTokens;

  /**
   * Display the balance of a token instead of the native token in ConnectWallet details button.
   *
   * @example
   * ```tsx
   * import { Base } from "@thirdweb-dev/chains";
   *
   * <ConnectWallet balanceToken={{
   *    1: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" // show USDC balance when connected to Ethereum mainnet
   *    [Base.chainId]: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", // show Dai stablecoin token balance when connected to Base mainnet
   *  }}
   * />
   * ```
   */
  displayBalanceToken?: Record<number, string>;

  /**
   * Hide the "switch to Personal wallet" option in the wallet modal which is shown when wallet is connected to a Smart Wallet
   *
   * The default is `false`
   */
  hideSwitchToPersonalWallet?: boolean;

  /**
   * Hide the "Disconnect Wallet" button in the ConnectWallet Dropdown.
   *
   * By default it is `false`
   *
   * @example
   * ```tsx
   * <ConnectWallet hideDisconnect={true} />
   * ```
   */
  hideDisconnect?: boolean;
} & ConnectWalletButtonProps;

export const ConnectWallet = ({
  detailsButton,
  theme,
  buttonTitle,
  modalTitle,
  modalTitleIconUrl,
  hideReceiveButton,
  hideSendButton,
  extraRows,
  hideTestnetFaucet,
  displayBalanceToken,
  switchToActiveChain,
  termsOfServiceUrl,
  privacyPolicyUrl,
  supportedTokens,
  hideSwitchToPersonalWallet,
  hideDisconnect,
}: ConnectWalletProps) => {
  const globalTheme = useGlobalTheme();
  const l = useLocale();
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

  const supportedTokensMemo = useMemo(() => {
    if (!supportedTokens) {
      return defaultTokens;
    }

    const tokens = { ...defaultTokens };
    for (const k in supportedTokens) {
      const key = Number(k);
      tokens[key] = supportedTokens[key];
    }

    return tokens;
  }, [supportedTokens]);

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
                <ActivityIndicator
                  size="small"
                  color={globalTheme.colors.buttonTextColor}
                />
              ) : (
                <Text variant="bodyLarge" color="buttonTextColor">
                  {l.common.switch_network}
                </Text>
              )}
            </BaseButton>
          ) : (
            <WalletDetailsButton
              address={address}
              detailsButton={detailsButton}
              extraRows={extraRows}
              hideTestnetFaucet={hideTestnetFaucet}
              hideReceiveButton={hideReceiveButton}
              hideSendButton={hideSendButton}
              hideDisconnect={hideDisconnect}
              supportedTokens={supportedTokensMemo}
              displayBalanceToken={displayBalanceToken}
              hideSwitchToPersonalWallet={hideSwitchToPersonalWallet}
            />
          )
        ) : (
          <ConnectWalletButton
            modalTitle={modalTitle}
            buttonTitle={buttonTitle}
            modalTitleIconUrl={modalTitleIconUrl}
            theme={theme}
            termsOfServiceUrl={termsOfServiceUrl}
            privacyPolicyUrl={privacyPolicyUrl}
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
