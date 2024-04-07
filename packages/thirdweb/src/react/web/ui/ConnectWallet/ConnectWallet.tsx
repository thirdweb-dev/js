import styled from "@emotion/styled";
import { useContext, useEffect, useMemo, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import { AutoConnect } from "../../../core/hooks/connection/useAutoConnect.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import {
  useActiveAccount,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useSwitchActiveWalletChain,
} from "../../../core/hooks/wallets/wallet-hooks.js";
import { WalletConnectionContext } from "../../../core/providers/wallet-connection.js";
import {
  SetModalConfigCtx,
  WalletUIStatesProvider,
  useSetIsWalletModalOpen,
} from "../../providers/wallet-ui-states-provider.js";
import { canFitWideModal } from "../../utils/canFitWideModal.js";
import { getDefaultWallets } from "../../wallets/defaultWallets.js";
import { Spinner } from "../components/Spinner.js";
import { Button } from "../components/buttons.js";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../design-system/CustomThemeProvider.js";
import { fadeInAnimation } from "../design-system/animations.js";
import type { ConnectButtonProps } from "./ConnectWalletProps.js";
import { ConnectedWalletDetails } from "./Details.js";
import ConnectModal from "./Modal/ConnectModal.js";
import { defaultTokens } from "./defaultTokens.js";
import { getConnectLocale } from "./locale/getConnectLocale.js";
import type { ConnectLocale } from "./locale/types.js";

const TW_CONNECT_WALLET = "tw-connect-wallet";

/**
 * A component that allows the user to connect their wallet.
 * It renders a button which when clicked opens a modal to allow users to connect to wallets specified in the `ThirdwebProvider`'s `wallets` prop.
 * @example
 * ```tsx
 * <ConnectButton
 *    client={client}
 * />
 * ```
 * @param props
 * Props for the `ConnectButton` component
 *
 * Refer to [ConnectButtonProps](https://portal.thirdweb.com/references/typescript/v5/ConnectButtonProps) to see the available props.
 * @component
 */
export function ConnectButton(props: ConnectButtonProps) {
  const wallets = props.wallets || getDefaultWallets();
  const localeId = props.locale || "en_US";
  const [locale, setLocale] = useState<ConnectLocale | undefined>();

  useEffect(() => {
    getConnectLocale(localeId).then(setLocale);
  }, [localeId]);

  const autoConnectComp = props.autoConnect !== false && (
    <AutoConnect
      appMetadata={props.appMetadata}
      client={props.client}
      wallets={wallets}
      timeout={
        typeof props.autoConnect === "boolean"
          ? undefined
          : props.autoConnect?.timeout
      }
      accountAbstraction={props.accountAbstraction}
    />
  );

  if (!locale) {
    return (
      <AnimatedButton
        disabled={true}
        className={`${
          props.connectButton?.className || ""
        } ${TW_CONNECT_WALLET}`}
        variant="primary"
        type="button"
        style={{
          minWidth: "140px",
          ...props.connectButton?.style,
        }}
      >
        {autoConnectComp}
        <Spinner size="sm" color="primaryButtonText" />
      </AnimatedButton>
    );
  }

  return (
    <WalletConnectionContext.Provider
      value={{
        appMetadata: props.appMetadata,
        client: props.client,
        wallets: wallets,
        locale: props.locale || "en_US",
        connectLocale: locale,
        chain: props.chain,
        chains: props.chains,
        walletConnect: props.walletConnect,
        accountAbstraction: props.accountAbstraction,
        recommendedWallets: props.recommendedWallets,
        showAllWallets: props.showAllWallets,
      }}
    >
      <WalletUIStatesProvider theme="dark">
        <ConnectButtonInner {...props} connectLocale={locale} />
        <ConnectModal />
        {autoConnectComp}
      </WalletUIStatesProvider>
    </WalletConnectionContext.Provider>
  );
}

function ConnectButtonInner(
  props: ConnectButtonProps & {
    connectLocale: ConnectLocale;
  },
) {
  const activeAccount = useActiveAccount();
  const activeWalletChain = useActiveWalletChain();
  const contextTheme = useCustomTheme();
  const theme = props.theme || contextTheme || "dark";
  const connectionStatus = useActiveWalletConnectionStatus();
  const locale = props.connectLocale;

  const isLoading = connectionStatus === "connecting";

  const connectButtonLabel =
    props.connectButton?.label || locale.defaultButtonTitle;

  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  const setModalConfig = useContext(SetModalConfigCtx);

  // const authConfig = useThirdwebAuthContext();
  // const { logout } = useLogout();
  // const isNetworkMismatch = useNetworkMismatch();
  const isNetworkMismatch =
    activeWalletChain?.id !== undefined &&
    props.chain?.id &&
    activeWalletChain.id !== props.chain.id;

  // const [showSignatureModal, setShowSignatureModal] = useState(false);
  // const address = useActiveWalletAddress();
  // const { user } = useUser();

  // const connectedButNotSignedIn =
  //   !!authConfig?.authUrl &&
  //   !!address &&
  //   (!user?.address || address !== user?.address);

  // const requiresSignIn = props.auth?.loginOptional
  //   ? false
  //   : connectedButNotSignedIn;

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
  // useEffect(() => {
  //   if (!activeWallet) {
  //     setShowSignatureModal(false);
  //   }
  // }, [activeWallet]);

  const wallets = props.wallets || getDefaultWallets();

  return (
    <CustomThemeProvider theme={theme}>
      {/* <Modal
        size="compact"
        open={showSignatureModal}
        setOpen={(value) => {
          if (!value) {
            setShowSignatureModal(false);
          }
        }}
      >
        <SignatureScreen
          modalSize="compact"
          termsOfServiceUrl={props.termsOfServiceUrl}
          privacyPolicyUrl={props.privacyPolicyUrl}
          onDone={() => setShowSignatureModal(false)}
        />
      </Modal> */}

      {(() => {
        // wallet is not connected
        if (!activeAccount) {
          // Connect Wallet button
          return (
            <AnimatedButton
              disabled={isLoading}
              className={`${
                props.connectButton?.className || ""
              } ${TW_CONNECT_WALLET}`}
              data-theme={theme}
              data-is-loading={isLoading}
              variant="primary"
              type="button"
              style={{
                minWidth: "140px",
                ...props.connectButton?.style,
              }}
              aria-label={
                connectionStatus === "connecting"
                  ? locale.connecting
                  : connectButtonLabel
              }
              onClick={() => {
                let modalSize = props.connectModal?.size || "wide";

                if (!canFitWideModal() || wallets.length === 1) {
                  modalSize = "compact";
                }

                setModalConfig({
                  title: props.connectModal?.title || locale.defaultModalTitle,
                  theme,
                  data: undefined,
                  modalSize,
                  termsOfServiceUrl: props.connectModal?.termsOfServiceUrl,
                  privacyPolicyUrl: props.connectModal?.privacyPolicyUrl,
                  welcomeScreen: props.connectModal?.welcomeScreen,
                  titleIconUrl: props.connectModal?.titleIcon,
                  // auth: props.auth,
                  onConnect: props.onConnect,
                  chain: props.chain ? props.chain : undefined,
                  chains: props.chains,
                  showThirdwebBranding:
                    props.connectModal?.showThirdwebBranding,
                });
                setIsWalletModalOpen(true);
              }}
              data-test="connect-wallet-button"
            >
              {isLoading ? (
                <Spinner size="sm" color="primaryButtonText" />
              ) : (
                connectButtonLabel
              )}
            </AnimatedButton>
          );
        }

        // switch network button
        if (props.chain && isNetworkMismatch) {
          return (
            <SwitchNetworkButton
              style={props.switchButton?.style}
              className={props.switchButton?.className}
              switchNetworkBtnTitle={props.switchButton?.label}
              targetChain={props.chain}
            />
          );
        }

        // sign in button
        // else if (requiresSignIn) {
        //   return (
        //     <Button
        //       variant="primary"
        //       onClick={() => {
        //         if (activeWallet) {
        //           setShowSignatureModal(true);
        //         }
        //       }}
        //       data-theme={theme}
        //       className={`${TW_CONNECT_WALLET}--sign-in ${
        //         props.className || ""
        //       }`}
        //       style={{
        //         minWidth: "140px",
        //         ...props.style,
        //       }}
        //       data-test="sign-in-button"
        //     >
        //       <Container flex="row" center="y" gap="sm">
        //         <LockIcon size={iconSize.sm} />
        //         <span> {locale.connectWallet.signIn} </span>
        //       </Container>
        //     </Button>
        //   );
        // }

        // wallet details button
        return (
          <ConnectedWalletDetails
            theme={theme}
            detailsButton={props.detailsButton}
            detailsModal={props.detailsModal}
            supportedTokens={supportedTokens}
            onDisconnect={() => {
              // if (authConfig?.authUrl) {
              //   logout();
              //   props?.auth?.onLogout?.();
              // }
            }}
            chains={props?.chains || []}
          />
        );
      })()}
    </CustomThemeProvider>
  );
}

/**
 * @internal
 */
function SwitchNetworkButton(props: {
  style?: React.CSSProperties;
  className?: string;
  switchNetworkBtnTitle?: string;
  targetChain: Chain;
}) {
  const switchChain = useSwitchActiveWalletChain();
  const [switching, setSwitching] = useState(false);
  const locale = useWalletConnectionCtx().connectLocale;

  const switchNetworkBtnTitle =
    props.switchNetworkBtnTitle ?? locale.switchNetwork;

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
          await switchChain(props.targetChain);
        } catch (e) {
          console.error(e);
        }
        setSwitching(false);
      }}
      style={{
        minWidth: "140px",
        ...props.style,
      }}
      aria-label={switching ? locale.switchingNetwork : undefined}
    >
      {switching ? (
        <Spinner size="sm" color="primaryButtonText" />
      ) : (
        switchNetworkBtnTitle
      )}
    </AnimatedButton>
  );
}

const AnimatedButton = /* @__PURE__ */ styled(Button)({
  animation: `${fadeInAnimation} 300ms ease`,
});
