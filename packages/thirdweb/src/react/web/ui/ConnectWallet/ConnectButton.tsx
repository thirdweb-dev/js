"use client";

import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { getDefaultWallets } from "../../../../wallets/defaultWallets.js";
import { AccountProvider } from "../../../core/account/provider.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useSiweAuth } from "../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletConnectionStatus } from "../../../core/hooks/wallets/useActiveWalletConnectionStatus.js";
import { useConnectionManager } from "../../../core/providers/connection-manager.js";
import { defaultTokens } from "../../../core/utils/defaultTokens.js";
import {
  useSetIsWalletModalOpen,
  WalletUIStatesProvider,
} from "../../providers/wallet-ui-states-provider.js";
import { canFitWideModal } from "../../utils/canFitWideModal.js";
import { usePreloadWalletProviders } from "../../utils/usePreloadWalletProviders.js";
import { AutoConnect } from "../AutoConnect/AutoConnect.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Modal } from "../components/Modal.js";
import { Spinner } from "../components/Spinner.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { ConnectedWalletDetails } from "./Details.js";
import { LockIcon } from "./icons/LockIcon.js";
import { useConnectLocale } from "./locale/getConnectLocale.js";
import type { ConnectLocale } from "./locale/types.js";
import ConnectModal from "./Modal/ConnectModal.js";
import { SignatureScreen } from "./screens/SignatureScreen.js";

const TW_CONNECT_WALLET = "tw-connect-wallet";

/**
 * A fully featured wallet connection component that allows to:
 *
 * - Connect to 500+ external wallets
 * - Connect with email, phone, passkey or socials
 * - Convert any wallet to a ERC4337 smart wallet for gasless transactions
 * - Sign in with ethereum (Auth)
 *
 * Once connected, the component allows to:
 *
 * - Resolve ENS names and avatars
 * - Manage multiple connected wallets
 * - Send and receive native tokens and ERC20 tokens
 * - View ERC20 tokens and NFTs
 * - Onramp, bridge and swap tokens
 * - Switch chains
 * - Connect to another app with WalletConnect
 *
 * @example
 *
 * ## Default setup
 *
 * ```tsx
 * import { createThirdwebClient } from "thirdweb";
 * import { ConnectButton } from "thirdweb/react";
 *
 * const client = createThirdwebClient({ clientId: "YOUR_CLIENT_ID" });
 *
 * <ConnectButton
 *    client={client}
 * />
 * ```
 *
 * [View all available config options](https://portal.thirdweb.com/references/typescript/v5/ConnectButtonProps)
 *
 * ## Customization options
 *
 * ### Customizing wallet options
 *
 * ```tsx
 * <ConnectButton
 *    client={client}
 *    wallets={[
 *      createWallet("io.metamask"),
 *      createWallet("com.coinbase.wallet"),
 *      createWallet("me.rainbow"),
 *    ]}
 * />
 * ```
 *
 * [View all available wallets](https://portal.thirdweb.com/typescript/v5/supported-wallets)
 *
 * ### Customizing the default chain to connect to
 *
 * ```tsx
 * import { sepolia } from "thirdweb/chains";
 *
 * <ConnectButton
 *   client={client}
 *   chain={sepolia}
 * />
 * ```
 *
 * ### Enabling Account Abstraction
 *
 * By passing the `accountAbstraction` prop, ALL connected wallets will be converted to smart accounts.
 * And by setting `sponsorGas` to `true`, all transactions done with those smart accounts will be sponsored.
 *
 * ```tsx
 * <ConnectButton
 * client={client}
 * accountAbstraction={{
 *   chain: sepolia,
 *   sponsorGas: true,
 * }}
 * />;
 * ```
 *
 * Note that this prop doesn't affect ecosystem wallets. Ecosystem wallets will only be converted to smart accounts if the ecosystem owner has enabled account abstraction.
 *
 * ### Enabling sign in with ethereum (Auth)
 *
 * ```tsx
 * <ConnectButton
 * client={client}
 * auth={{
 *   isLoggedIn: async (address) => {
 *     console.log("checking if logged in!", { address });
 *     return await isLoggedIn();
 *   },
 *   doLogin: async (params) => {
 *     console.log("logging in!");
 *     await login(params);
 *   },
 *   getLoginPayload: async ({ address }) =>
 *     generatePayload({ address }),
 *   doLogout: async () => {
 *     console.log("logging out!");
 *     await logout();
 *   },
 * }}
 * />;
 * ```
 *
 * ### Customizing the theme
 *
 * ```tsx
 * <ConnectButton
 *    client={client}
 *    theme="light"
 * />
 * ```
 *
 * For more granular control, you can also pass a custom theme object:
 *
 * ```tsx
 * <ConnectButton
 *    client={client}
 *    theme={lightTheme({
 *      colors: {
 *        modalBg: "red",
 *      },
 *    })}
 * />
 * ```
 *
 * [View all available themes properties](https://portal.thirdweb.com/references/typescript/v5/Theme)
 *
 * ### Changing the display language
 *
 * ```tsx
 * <ConnectEmbed
 *    client={client}
 *    locale="ja_JP"
 * />
 * ```
 *
 * [View all available locales](https://portal.thirdweb.com/references/typescript/v5/LocaleId)
 *
 * ### Customizing the connect button UI
 *
 * ```tsx
 * <ConnectButton
 *    client={client}
 *    connectButton={{
 *      label: "Sign in to MyApp",
 *    }}
 * />
 * ```
 *
 * ### Customizing the modal UI
 *
 * ```tsx
 * <ConnectButton
 *    client={client}
 *    connectModal={{
 *      title: "Sign in to MyApp",
 *      titleIcon: "https://example.com/logo.png",
 *      size: "compact",
 *    }}
 * />
 * ```
 *
 * ### Customizing details button UI (after connecting)
 *
 * ```tsx
 * <ConnectButton
 *    client={client}
 *    detailsButton={{
 *      displayBalanceToken: {
 *        [sepolia.id]: "0x...", // token address to display balance for
 *        [ethereum.id]: "0x...", // token address to display balance for
 *      },
 *    }}
 * />
 * ```
 *
 * [View all available auth helper functions](https://portal.thirdweb.com/references/typescript/v5/createAuth)
 *
 * ### Customizing the Auth sign in button (after connecting, but before authenticating)
 *
 * ```tsx
 * <ConnectButton
 *   client={client}
 *   auth={{ ... }}
 *   signInButton: {
 *     label: "Authenticate with MyApp",
 *   },
 * }}
 * />;
 * ```
 *
 * ### Customizing supported Tokens and NFTs
 *
 * These tokens and NFTs will be shown in the modal when the user clicks "View Assets", as well as the send token screen.
 *
 * ```tsx
 * <ConnectButton
 *   client={client}
 *   supportedTokens={{
 *     [ethereum.id]: [
 *       {
 *         address: "0x...",
 *         name: "MyToken",
 *         symbol: "MT",
 *         icon: "https://example.com/icon.png",
 *       },
 *     ],
 *   }}
 *   supportedNFTs={{
 *     [ethereum.id]: [
 *       "0x...", // nft contract address
 *     ],
 *   }}
 * />
 * ```
 *
 * ### Customizing the orders of the tabs in the [View Funds] screen
 * When you click on "View Assets", by default the "Tokens" tab is shown first.
 * If you want to show the "NFTs" tab first, change the order of the asset tabs to: ["nft", "token"]
 * Note: If an empty array is passed, the [View Funds] button will be hidden
 *
 * ```tsx
 * <ConnectButton
 *   client={client}
 *   detailsModal={{
 *     assetTabs: ["nft", "token"],
 *   }}
 * />
 * ```
 *
 * ### Callback for when the details modal is closed
 * ```tsx
 * <ConnectButton
 *   detailsModal={{
 *     onClose: (screen: string) => {
 *       console.log({ screen });
 *     }
 *   }}
 * />
 * ```
 *
 * @param props
 * Props for the `ConnectButton` component
 *
 * Refer to [ConnectButtonProps](https://portal.thirdweb.com/references/typescript/v5/ConnectButtonProps) to see the available props.
 *
 * @returns A JSX element that renders the <ConnectButton> component.
 *
 * @component
 * @walletConnection
 */
export function ConnectButton(props: ConnectButtonProps) {
  const wallets = useMemo(
    () =>
      props.wallets ||
      getDefaultWallets({
        appMetadata: props.appMetadata,
        chains: props.chains,
        executionMode: props.accountAbstraction
          ? {
              mode: "EIP4337",
              smartAccount: props.accountAbstraction,
            }
          : undefined,
      }),
    [props.wallets, props.appMetadata, props.chains, props.accountAbstraction],
  );
  const localeQuery = useConnectLocale(props.locale || "en_US");
  const connectionManager = useConnectionManager();
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const siweAuth = useSiweAuth(activeWallet, activeAccount, props.auth);
  const hiddenWallets =
    props.hiddenWallets || props.detailsModal?.hiddenWallets;

  usePreloadWalletProviders({
    wallets,
  });

  // Add props.chain and props.chains to defined chains store
  useEffect(() => {
    if (props.chain) {
      connectionManager.defineChains([props.chain]);
    }
  }, [props.chain, connectionManager]);

  useEffect(() => {
    if (props.chains) {
      connectionManager.defineChains(props.chains);
    }
  }, [props.chains, connectionManager]);

  const size = useMemo(() => {
    return !canFitWideModal() || wallets.length === 1
      ? "compact"
      : props.connectModal?.size || "compact";
  }, [wallets.length, props.connectModal?.size]);

  const preferredChain =
    props.accountAbstraction?.chain || props.chain || props.chains?.[0];

  const autoConnectComp = props.autoConnect !== false && (
    <AutoConnect
      accountAbstraction={props.accountAbstraction}
      appMetadata={props.appMetadata}
      chain={preferredChain}
      client={props.client}
      onConnect={props.onConnect}
      siweAuth={siweAuth}
      timeout={
        typeof props.autoConnect === "boolean"
          ? undefined
          : props.autoConnect?.timeout
      }
      wallets={wallets}
    />
  );

  if (!localeQuery.data) {
    const combinedClassName = `${props.connectButton?.className || ""} ${TW_CONNECT_WALLET}`;
    return (
      <AnimatedButton
        className={combinedClassName}
        disabled={true}
        style={{
          height: "50px",
          minWidth: "165px",
          ...props.connectButton?.style,
        }}
        type="button"
        variant="primary"
      >
        {autoConnectComp}
        <Spinner color="primaryButtonText" size="sm" />
      </AnimatedButton>
    );
  }

  return (
    <WalletUIStatesProvider isOpen={false} theme={props.theme}>
      <ConnectButtonInner
        {...props}
        connectLocale={localeQuery.data}
        siweAuth={siweAuth}
      />
      <ConnectModal
        accountAbstraction={props.accountAbstraction}
        auth={props.auth}
        chain={preferredChain}
        chains={props.chains}
        client={props.client}
        connectLocale={localeQuery.data}
        hiddenWallets={hiddenWallets}
        localeId={props.locale || "en_US"}
        meta={{
          privacyPolicyUrl: props.connectModal?.privacyPolicyUrl,
          requireApproval: props.connectModal?.requireApproval,
          showThirdwebBranding: props.connectModal?.showThirdwebBranding,
          termsOfServiceUrl: props.connectModal?.termsOfServiceUrl,
          title: props.connectModal?.title,
          titleIconUrl: props.connectModal?.titleIcon,
        }}
        onConnect={props.onConnect}
        recommendedWallets={props.recommendedWallets}
        shouldSetActive={true}
        showAllWallets={props.showAllWallets}
        size={size}
        walletConnect={props.walletConnect}
        wallets={wallets}
        welcomeScreen={props.connectModal?.welcomeScreen}
      />
      {autoConnectComp}
    </WalletUIStatesProvider>
  );
}

function ConnectButtonInner(
  props: ConnectButtonProps & {
    connectLocale: ConnectLocale;
    siweAuth: ReturnType<typeof useSiweAuth>;
  },
) {
  const siweAuth = props.siweAuth;
  const activeAccount = useActiveAccount();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const hiddenWallets =
    props.hiddenWallets || props.detailsModal?.hiddenWallets;

  // if wallet gets disconnected suddently, close the signature modal if it's open
  useEffect(() => {
    if (!activeAccount) {
      setShowSignatureModal(false);
    }
  }, [activeAccount]);

  const theme = props.theme || "dark";
  const connectionStatus = useActiveWalletConnectionStatus();
  const locale = props.connectLocale;

  const isLoading = connectionStatus === "connecting";

  const connectButtonLabel =
    props.connectButton?.label || locale.defaultButtonTitle;

  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  const supportedTokens = useMemo(() => {
    if (!props.supportedTokens) {
      return undefined;
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

  if (!activeAccount) {
    // Connect Wallet button
    const combinedClassName = `${props.connectButton?.className || ""} ${TW_CONNECT_WALLET}`;
    return (
      <AnimatedButton
        aria-label={
          connectionStatus === "connecting"
            ? locale.connecting
            : typeof connectButtonLabel === "string"
              ? connectButtonLabel
              : locale.defaultButtonTitle
        }
        className={combinedClassName}
        data-is-loading={isLoading}
        data-test="connect-wallet-button"
        data-theme={theme}
        disabled={isLoading}
        onClick={() => {
          setIsWalletModalOpen(true);
        }}
        style={{
          fontSize: "16px",
          height: "50px",
          minWidth: "165px",
          ...props.connectButton?.style,
        }}
        type="button"
        variant="primary"
      >
        {isLoading ? (
          <Spinner color="primaryButtonText" size="sm" />
        ) : (
          connectButtonLabel
        )}
      </AnimatedButton>
    );
  }

  if (siweAuth.requiresAuth) {
    // loading state if loading
    // TODO: figure out a way to consolidate the loading states with the ones from locale loading
    if (siweAuth.isPending || siweAuth.isLoggingIn || siweAuth.isLoggingOut) {
      const combinedClassName = `${props.connectButton?.className || ""} ${TW_CONNECT_WALLET}`;
      return (
        <AnimatedButton
          className={combinedClassName}
          disabled={true}
          style={{
            height: "50px",
            minWidth: "165px",
            ...props.connectButton?.style,
          }}
          type="button"
          variant="primary"
        >
          <Spinner color="primaryButtonText" size="sm" />
        </AnimatedButton>
      );
    }
    // sign in button + modal if *not* loading and *not* logged in
    if (!siweAuth.isLoggedIn) {
      return (
        <>
          <Button
            className={props.signInButton?.className}
            onClick={() => {
              setShowSignatureModal(true);
            }}
            style={{
              minHeight: "50px",
              minWidth: "165px",
              ...props.signInButton?.style,
            }}
            type="button"
            variant="primary"
          >
            {siweAuth.isLoggingIn ? (
              <Spinner color="primaryButtonText" size="sm" />
            ) : (
              <Container center="y" flex="row" gap="sm">
                <LockIcon size={iconSize.sm} />
                <span> {props.signInButton?.label || locale.signIn} </span>
              </Container>
            )}
          </Button>
          <Modal
            open={showSignatureModal}
            setOpen={setShowSignatureModal}
            size="compact"
          >
            <SignatureScreen
              auth={props.auth}
              client={props.client}
              connectLocale={locale}
              modalSize="compact"
              onDone={() => setShowSignatureModal(false)}
              privacyPolicyUrl={props.connectModal?.privacyPolicyUrl}
              termsOfServiceUrl={props.connectModal?.termsOfServiceUrl}
            />
          </Modal>
        </>
      );
    }
    // otherwise, show the details button
  }

  return (
    <AccountProvider address={activeAccount.address} client={props.client}>
      <ConnectedWalletDetails
        chain={props.chain}
        chains={props?.chains || []}
        client={props.client}
        connectLocale={locale}
        connectOptions={{
          accountAbstraction: props.accountAbstraction,
          appMetadata: props.appMetadata,
          chain: props.chain,
          chains: props.chains,
          connectModal: props.connectModal,
          hiddenWallets: hiddenWallets,
          recommendedWallets: props.recommendedWallets,
          showAllWallets: props.showAllWallets,
          walletConnect: props.walletConnect,
          wallets: props.wallets,
        }}
        detailsButton={props.detailsButton}
        detailsModal={{
          ...props.detailsModal,
          hiddenWallets: hiddenWallets,
        }}
        onDisconnect={(info) => {
          // logout on explicit disconnect!
          if (siweAuth.requiresAuth) {
            siweAuth.doLogout();
          }
          props.onDisconnect?.(info);
        }}
        supportedNFTs={props.supportedNFTs}
        supportedTokens={supportedTokens}
        switchButton={props.switchButton}
        theme={theme}
      />
    </AccountProvider>
  );
}

const AnimatedButton = /* @__PURE__ */ styled(Button)({
  animation: `${fadeInAnimation} 300ms ease`,
});
