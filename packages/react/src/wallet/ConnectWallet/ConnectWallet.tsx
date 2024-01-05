import { Theme, iconSize } from "../../design-system";
import { ConnectedWalletDetails, type DropDownPosition } from "./Details";
import {
  useAddress,
  useConnectionStatus,
  useDisconnect,
  useLogout,
  useNetworkMismatch,
  useSwitchChain,
  useThirdwebAuthContext,
  useUser,
  useWallet,
  useWalletContext,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  SetModalConfigCtx,
  useSetIsWalletModalOpen,
} from "../../evm/providers/wallet-ui-states-provider";
import { Button } from "../../components/buttons";
import { Spinner } from "../../components/Spinner";
import styled from "@emotion/styled";
import type { NetworkSelectorProps } from "./NetworkSelector";
import { onModalUnmount } from "./constants";
import { isMobile } from "../../evm/utils/isMobile";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../design-system/CustomThemeProvider";
import { WelcomeScreen } from "./screens/types";
import { fadeInAnimation } from "../../design-system/animations";
import { SupportedTokens, defaultTokens } from "./defaultTokens";
import { Container } from "../../components/basic";
import { LockIcon } from "./icons/LockIcon";
import { SignatureScreen } from "./SignatureScreen";
import { Modal } from "../../components/Modal";
import { useTWLocale } from "../../evm/providers/locale-provider";

export type ConnectWalletProps = {
  /**
   * CSS class to apply to the button element
   *
   * For some CSS properties, you may need to use the !important to override the default styles
   *
   * ```tsx
   * <ConnectWallet className="my-custom-class" />
   * ```
   */
  className?: string;

  /**
   * Set the theme for the button and modal.
   *
   * By default it is set to "dark" if `theme` is not set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)
   * If a `theme` is set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) then that theme will be used by default which can be overridden by setting `theme` prop on [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component
   *
   * theme can be set to either "dark" or "light" or a custom theme object. You can also import `lightTheme` or `darkTheme` functions from `@thirdweb-dev/react` to use the default themes as base and overrides parts of it.
   *
   * @example
   * ```ts
   * import { lightTheme } from "@thirdweb-dev/react";
   * const customTheme = lightTheme({
   *  colors: {
   *    modalBg: 'red'
   *  }
   * })
   * ```
   */
  theme?: "dark" | "light" | Theme;

  /**
   * set custom label for the button.
   *
   * The default is `"Connect"`
   *
   * @example
   * ```tsx
   * <ConnectWallet btnTitle="Sign in" />
   * ```
   */
  btnTitle?: string;

  /**
   * Change the title of ConnectWallet Modal
   *
   * The default is `"Connect"`
   */
  modalTitle?: string;

  /**
   * Replace the thirdweb icon next to modalTitle and set your own iconUrl
   *
   * Set to empty string to hide the icon
   */
  modalTitleIconUrl?: string;

  /**
   * Render a custom button to display connected wallet details instead of the default one
   *
   * ```tsx
   * const address = useAddress();
   *
   * <ConnectWallet
   *  detailsBtn={() => {
   *    return (
   *      <button>
   *        connected to {address}
   *      </button>
   *    )
   *  }}
   * />
   * ```
   */
  detailsBtn?: () => JSX.Element;

  /**
   * When user connects the wallet using ConnectWallet Modal, a "Details Button" is rendered. Clicking on this button opens a dropdown which opens in a certain direction relative to the Details button.
   *
   * `dropdownPosition` prop allows you to customize the direction the dropdown should open relative to the Details button.
   *
   * ```tsx
   * <ConnectWallet
   *  dropdownPosition={{
   *    side: "bottom", // or use:  "top" | "bottom" | "left" | "right"
   *    align: "end", // or use:  "start" | "center" | "end";
   *  }}
   *  />
   * ```
   */
  dropdownPosition?: DropDownPosition;

  /**
   * Enforce that users must sign in with their wallet using [auth](https://portal.thirdweb.com/wallets/auth) after connecting their wallet.
   *
   * This requires the `authConfig` prop to be set on the [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) component.
   */
  auth?: {
    /**
     * specify whether signing in is optional or not.
     *
     * By default it is `true` if `authConfig` is set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)
     */
    loginOptional?: boolean;
    /**
     * Callback to be called after user signs in with their wallet
     */
    onLogin?: (token: string) => void;
    /**
     * Callback to be called after user signs out
     */
    onLogout?: () => void;
  };

  /**
   * CSS styles to apply to the button element
   */
  style?: React.CSSProperties;

  /**
   * customize the Network selector shown
   */
  networkSelector?: Omit<
    NetworkSelectorProps,
    "theme" | "onClose" | "chains" | "open"
  >;

  /**
   * Hide the "Request Testnet funds" link in ConnectWallet dropdown which is shown when user is connected to a testnet.
   *
   * By default it is `false`
   *
   * @example
   * ```tsx
   * <ConnectWallet hideTestnetFaucet={false} />
   * ```
   */
  hideTestnetFaucet?: boolean;

  /**
   * Whether to show "Switch Network" button if the wallet is connected,
   * but it is not connected to the `activeChain` provided in [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)
   *
   * Please, note that if you support multiple networks in your app this prop should
   * be set to `false` to allow users to switch between networks.
   *
   * By default it is `false`
   */
  switchToActiveChain?: boolean;

  /**
   * Set the size of the modal - `compact` or `wide` on desktop
   *
   * Modal size is always `compact` on mobile
   *
   * By default it is `"wide"` for desktop.
   */
  modalSize?: "compact" | "wide";

  /**
   * If provided, Modal will show a Terms of Service message at the bottom with below link
   *
   * @example
   * ```tsx
   * <ConnectWallet termsOfServiceUrl="https://your-terms-of-service-url.com" />
   * ```
   */
  termsOfServiceUrl?: string;

  /**
   * If provided, Modal will show a Privacy Policy message at the bottom with below link
   *
   * @example
   * ```tsx
   * <ConnectWallet privacyPolicyUrl="https://your-privacy-policy-url.com" />
   * ```
   */
  privacyPolicyUrl?: string;

  /**
   * Customize the welcome screen. This prop is only applicable when modalSize prop is set to "wide". On "wide" Modal size, a welcome screen is shown on the right side of the modal.
   *
   * This screen can be customized in two ways
   *
   * #### 1. Customize Metadata and Image
   *
   * ```tsx
   * <ConnectWallet welcomeScreen={{
   *  title: "your title",
   *  subtitle: "your subtitle",
   *  img: {
   *   src: "https://your-image-url.png",
   *   width: 300,
   *   height: 50,
   *  },
   * }} />
   * ```
   *
   * #### 2. Render Custom Component
   *
   * ```tsx
   * <ConnectWallet
   *  welcomeScreen={() => {
   *  return <YourCustomComponent />
   * }}
   * />
   * ```
   */
  welcomeScreen?: WelcomeScreen;

  /**
   * Customize the tokens shown in the "Send Funds" screen for various networks.
   *
   * By default, The "Send Funds" screen shows a few popular tokens for default chains and the native token. For other chains it only shows the native token.
   *
   * @example
   *
   * supportedTokens prop allows you to customize this list as shown below which shows  "Dai Stablecoin" when users wallet is connected to the "Base" mainnet.
   *
   * ```tsx
   * import { ConnectWallet } from '@thirdweb-dev/react';
   * import { Base } from '@thirdweb-dev/chains';
   *
   * function Example() {
   *   return (
   * 		<ConnectWallet
   * 			supportedTokens={{
   * 				[Base.chainId]: [
   * 					{
   * 						address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // token contract address
   * 						name: 'Dai Stablecoin',
   * 						symbol: 'DAI',
   * 						icon: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1687143508',
   * 					},
   * 				],
   * 			}}
   * 		/>
   * 	);
   * }
   * ```
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
   * Hide the "Switch to Personal wallet" option in the wallet modal which is shown when wallet is connected to either Smart Wallet or Safe.
   *
   * By default it is `false`
   *
   * @example
   * ```tsx
   * <ConnectWallet hideSwitchToPersonalWallet={true} />
   * ```
   */
  hideSwitchToPersonalWallet?: boolean;
};

const TW_CONNECT_WALLET = "tw-connect-wallet";

/**
 * A component that allows the user to connect their wallet.
 *
 * it renders a button which when clicked opens a modal to allow users to connect to wallets specified in the [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)'s supportedWallets prop.
 *
 * This component must be descendant of [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)
 *
 * @example
 * ```tsx
 * <ConnectWallet />
 * ```
 *
 * @param props -
 * Props for the ConnectWallet component
 *
 * ### btnTitle (optional)
 * set custom label for the button.
 *
 * The default is `"Connect"`
 *
 * ```tsx
 * <ConnectWallet btnTitle="Sign in" />
 * ```
 *
 * ### modalSize (optional)
 * Set the size of the modal - `compact` or `wide` on desktop
 *
 * Modal size is always `compact` on mobile
 *
 * By default it is `"wide"` for desktop.
 *
 * ### modalTitle (optional)
 * Change the title of ConnectWallet Modal
 *
 * The default is `"Connect"`
 *
 * ### modalTitleIconUrl (optional)
 * Replace the thirdweb icon next to modalTitle and set your own iconUrl
 *
 * Set to empty string to hide the icon
 *
 * ### auth (optional)
 * The object contains the following properties to customize the authentication
 * - `loginOptional` - specify whether signing in is optional or not. By default it is `true` if `authConfig` is set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)
 * - `onLogin` - Callback to be called after user signs in with their wallet
 * - `onLogout` - Callback to be called after user signs out
 *
 * ### theme (optional)
 * Set the theme for the button and modal.
 *
 * By default it is set to "dark" if `theme` is not set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)
 * If a `theme` is set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) then that theme will be used by default which can be overridden by setting `theme` prop on [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component
 *
 * theme can be set to either "dark" or "light" or a custom theme object. You can also import `lightTheme` or `darkTheme` functions from `@thirdweb-dev/react` to use the default themes as base and overrides parts of it.
 *
 * ```ts
 * import { lightTheme } from "@thirdweb-dev/react";
 * const customTheme = lightTheme({
 *  colors: {
 *    modalBg: 'red'
 *  }
 * })
 * ```
 *
 * ### className (optional)
 * CSS class to apply to the button element
 *
 * ### detailsBtn
 * Render a custom button to display connected wallet details instead of the default one
 *
 * ```tsx
 * const address = useAddress();
 *
 * <ConnectWallet
 *  detailsBtn={() => {
 *    return (
 *      <button>
 *        connected to {address}
 *      </button>
 *    )
 *  }}
 * />
 * ```
 *
 * ### dropdownPosition (optional)
 * When user connects the wallet using ConnectWallet Modal, a "Details Button" is rendered. Clicking on this button opens a dropdown which opens in a certain direction relative to the Details button.
 *
 * `dropdownPosition` prop allows you to customize the direction the dropdown should open relative to the Details button.
 *
 * ```tsx
 * <ConnectWallet
 *  dropdownPosition={{
 *    side: "bottom", // or use:  "top" | "bottom" | "left" | "right"
 *    align: "end", // or use:  "start" | "center" | "end";
 *  }}
 *  />
 * ```
 *
 * ### style (optional)
 * CSS styles to apply to the button element
 *
 * ### networkSelector (optional)
 * Customize the Network selector shown
 *
 * ### hideTestnetFaucet (optional)
 * Hide the "Request Testnet funds" link in ConnectWallet dropdown which is shown when user is connected to a testnet.
 *
 * By default it is `false`
 *
 * ```tsx
 * <ConnectWallet hideTestnetFaucet={false} />
 * ```
 *
 * ### switchToActiveChain (optional)
 * Whether to show "Switch Network" button if the wallet is connected,
 * but it is not connected to the `activeChain` provided in [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)
 *
 * Please, note that if you support multiple networks in your app this prop should
 * be set to `false` to allow users to switch between networks.
 *
 * By default it is `false`
 *
 * For some CSS properties, you may need to use the !important to override the default styles
 *
 * ```tsx
 * <ConnectWallet className="my-custom-class" />
 * ```
 *
 * ### termsOfServiceUrl
 * If provided, Modal will show a Terms of Service message at the bottom with below link
 *
 * ```tsx
 * <ConnectWallet termsOfServiceUrl="https://your-terms-of-service-url.com" />
 * ```
 *
 * ### privacyPolicyUrl
 * If provided, Modal will show a Privacy Policy message at the bottom with below link
 *
 * ```tsx
 * <ConnectWallet privacyPolicyUrl="https://your-privacy-policy-url.com" />
 * ```
 *
 * ### welcomeScreen
 * Customize the welcome screen. This prop is only applicable when modalSize prop is set to "wide". On "wide" Modal size, a welcome screen is shown on the right side of the modal.
 *
 * This screen can be customized in two ways
 *
 * #### 1. Customize Metadata and Image
 *
 * ```tsx
 * <ConnectWallet welcomeScreen={{
 *  title: "your title",
 *  subtitle: "your subtitle",
 *  img: {
 *   src: "https://your-image-url.png",
 *   width: 300,
 *   height: 50,
 *  },
 * }} />
 * ```
 *
 * #### 2. Render Custom Component
 *
 * ```tsx
 * <ConnectWallet
 *  welcomeScreen={() => {
 *  return <YourCustomComponent />
 * }}
 * />
 * ```
 *
 *
 * ### supportedTokens
 * Customize the tokens shown in the "Send Funds" screen for various networks.
 *
 * By default, The "Send Funds" screen shows a few popular tokens for default chains and the native token. For other chains it only shows the native token.
 *
 * supportedTokens prop allows you to customize this list as shown below which shows  "Dai Stablecoin" when users wallet is connected to the "Base" mainnet.
 *
 * ```tsx
 * import { ConnectWallet } from '@thirdweb-dev/react';
 * import { Base } from '@thirdweb-dev/chains';
 *
 * function Example() {
 *   return (
 * 		<ConnectWallet
 * 			supportedTokens={{
 * 				[Base.chainId]: [
 * 					{
 * 						address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // token contract address
 * 						name: 'Dai Stablecoin',
 * 						symbol: 'DAI',
 * 						icon: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1687143508',
 * 					},
 * 				],
 * 			}}
 * 		/>
 * 	);
 * }
 * ```
 *
 * ### displayBalanceToken
 * Display the balance of a token instead of the native token in ConnectWallet details button.
 *
 * ```tsx
 * import { Base } from "@thirdweb-dev/chains";
 *
 * <ConnectWallet balanceToken={{
 *    1: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" // show USDC balance when connected to Ethereum mainnet
 *    [Base.chainId]: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", // show Dai stablecoin token balance when connected to Base mainnet
 *  }}
 * />
 * ```
 *
 * ### hideSwitchToPersonalWallet
 * Hide the "Switch to Personal wallet" option in the wallet modal which is shown when wallet is connected to either Smart Wallet or Safe.
 *
 * By default it is `false`
 *
 * ```tsx
 * <ConnectWallet hideSwitchToPersonalWallet={true} />
 * ```
 *
 */
export function ConnectWallet(props: ConnectWalletProps) {
  const activeWallet = useWallet();
  const contextTheme = useCustomTheme();
  const theme = props.theme || contextTheme || "dark";
  const connectionStatus = useConnectionStatus();
  const locale = useTWLocale();

  const walletConfigs = useWallets();
  const isLoading =
    connectionStatus === "connecting" || connectionStatus === "unknown";

  const btnTitle = props.btnTitle || locale.connectWallet.defaultButtonTitle;
  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  const setModalConfig = useContext(SetModalConfigCtx);

  const authConfig = useThirdwebAuthContext();

  const { logout } = useLogout();
  const isNetworkMismatch = useNetworkMismatch();
  const { activeChainSetExplicitly } = useWalletContext();

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const address = useAddress();
  const { user } = useUser();
  const disconnect = useDisconnect();

  const connectedButNotSignedIn =
    !!authConfig?.authUrl &&
    !!address &&
    (!user?.address || address !== user?.address);

  const requiresSignIn = props.auth?.loginOptional
    ? false
    : connectedButNotSignedIn;

  const supportedTokens = useMemo(() => {
    if (!props.supportedTokens) {
      return defaultTokens;
    }

    const tokens = { ...defaultTokens };
    for (const k in props.supportedTokens) {
      const key = Number(k);
      const tokenList = props.supportedTokens[key];
      if (tokenList) {
        tokens[key] = tokenList;
      }
    }

    return tokens;
  }, [props.supportedTokens]);

  // if wallet gets disconnected, close the signature modal
  useEffect(() => {
    if (!activeWallet) {
      setShowSignatureModal(false);
    }
  }, [activeWallet]);

  return (
    <CustomThemeProvider theme={theme}>
      <Modal
        size="compact"
        open={showSignatureModal}
        setOpen={(value) => {
          if (!value) {
            setShowSignatureModal(false);
            onModalUnmount(() => {
              disconnect();
            });
          }
        }}
      >
        <SignatureScreen
          modalSize="compact"
          termsOfServiceUrl={props.termsOfServiceUrl}
          privacyPolicyUrl={props.privacyPolicyUrl}
          onDone={() => setShowSignatureModal(false)}
        />
      </Modal>

      {(() => {
        // wallet is not connected
        if (!activeWallet) {
          // Connect Wallet button
          return (
            <AnimatedButton
              disabled={isLoading}
              className={`${props.className || ""} ${TW_CONNECT_WALLET}`}
              data-theme={theme}
              data-is-loading={isLoading}
              variant="primary"
              type="button"
              style={{
                minWidth: "140px",
                ...props.style,
              }}
              aria-label={
                connectionStatus === "connecting"
                  ? locale.connectWallet.connecting
                  : btnTitle
              }
              onClick={() => {
                let modalSize = props.modalSize || "wide";

                if (isMobile() || walletConfigs.length === 1) {
                  modalSize = "compact";
                }

                setModalConfig({
                  title:
                    props.modalTitle || locale.connectWallet.defaultModalTitle,
                  theme,
                  data: undefined,
                  modalSize,
                  termsOfServiceUrl: props.termsOfServiceUrl,
                  privacyPolicyUrl: props.privacyPolicyUrl,
                  welcomeScreen: props.welcomeScreen,
                  titleIconUrl: props.modalTitleIconUrl,
                  auth: props.auth,
                });
                setIsWalletModalOpen(true);
              }}
              data-test="connect-wallet-button"
            >
              {isLoading ? (
                <Spinner size="sm" color="primaryButtonText" />
              ) : (
                btnTitle
              )}
            </AnimatedButton>
          );
        }

        // switch network button
        if (
          props.switchToActiveChain &&
          isNetworkMismatch &&
          activeChainSetExplicitly
        ) {
          return (
            <SwitchNetworkButton
              style={props.style}
              className={props.className}
            />
          );
        }

        // sign in button
        else if (requiresSignIn) {
          return (
            <Button
              variant="primary"
              onClick={() => {
                if (activeWallet) {
                  setShowSignatureModal(true);
                }
              }}
              data-theme={theme}
              className={`${TW_CONNECT_WALLET}--sign-in ${
                props.className || ""
              }`}
              style={{
                minWidth: "140px",
                ...props.style,
              }}
              data-test="sign-in-button"
            >
              <Container flex="row" center="y" gap="sm">
                <LockIcon size={iconSize.sm} />
                <span> {locale.connectWallet.signIn} </span>
              </Container>
            </Button>
          );
        }

        // wallet details button
        return (
          <ConnectedWalletDetails
            theme={theme}
            networkSelector={props.networkSelector}
            dropdownPosition={props.dropdownPosition}
            className={props.className}
            style={props.style}
            detailsBtn={props.detailsBtn}
            hideTestnetFaucet={props.hideTestnetFaucet}
            supportedTokens={supportedTokens}
            displayBalanceToken={props.displayBalanceToken}
            onDisconnect={() => {
              if (authConfig?.authUrl) {
                logout();
                props?.auth?.onLogout?.();
              }
            }}
            hideSwitchToPersonalWallet={props.hideSwitchToPersonalWallet}
          />
        );
      })()}
    </CustomThemeProvider>
  );
}

function SwitchNetworkButton(props: {
  style?: React.CSSProperties;
  className?: string;
}) {
  const { activeChain } = useWalletContext();
  const switchChain = useSwitchChain();
  const [switching, setSwitching] = useState(false);
  const locale = useTWLocale();

  return (
    <AnimatedButton
      className={`${TW_CONNECT_WALLET}--switch-network ${
        props.className || ""
      }`}
      variant="primary"
      type="button"
      data-is-loading={switching}
      data-test="switch-network-button"
      disabled={switching}
      onClick={async () => {
        setSwitching(true);
        try {
          await switchChain(activeChain.chainId);
        } catch {
          // ignore
        }
        setSwitching(false);
      }}
      style={{
        minWidth: "140px",
        ...props.style,
      }}
      aria-label={switching ? locale.connectWallet.switchingNetwork : undefined}
    >
      {switching ? (
        <Spinner size="sm" color="primaryButtonText" />
      ) : (
        locale.connectWallet.switchNetwork
      )}
    </AnimatedButton>
  );
}

const AnimatedButton = /* @__PURE__ */ styled(Button)({
  animation: `${fadeInAnimation} 300ms ease`,
});
