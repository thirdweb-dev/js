import styled from "@emotion/styled";
import { useContext, useState, useMemo, useEffect } from "react";
import { Spinner } from "../components/Spinner.js";
import { Button } from "../components/buttons.js";
import {
  useCustomTheme,
  CustomThemeProvider,
} from "../design-system/CustomThemeProvider.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { ConnectedWalletDetails } from "./Details.js";
import { defaultTokens } from "./defaultTokens.js";
import {
  useActiveAccount,
  useActiveWalletChainId,
  useActiveWalletConnectionStatus,
  useSwitchActiveWalletChain,
} from "../../providers/wallet-provider.js";
import { useThirdwebProviderProps } from "../../hooks/others/useThirdwebProviderProps.js";
import { useTWLocale } from "../../providers/locale-provider.js";
import {
  useSetIsWalletModalOpen,
  SetModalConfigCtx,
} from "../../providers/wallet-ui-states-provider.js";
import type { ConnectWalletProps } from "./ConnectWalletProps.js";
import { canFitWideModal } from "../../utils/canFitWideModal.js";

const TW_CONNECT_WALLET = "tw-connect-wallet";

/**
 * A component that allows the user to connect their wallet.
 * It renders a button which when clicked opens a modal to allow users to connect to wallets specified in the `ThirdwebProvider`'s `wallets` prop.
 * @example
 * ```tsx
 * <ConnectWallet />
 * ```
 * @param props
 * Props for the `ConnectWallet` component
 *
 * Refer to [ConnectWalletProps](https://portal.thirdweb.com/references/typescript/v5/ConnectWalletProps) to see the available props.
 * @returns `JSX.Element`
 */
export function ConnectWallet(props: ConnectWalletProps) {
  const activeAccount = useActiveAccount();
  const activeWalletChainId = useActiveWalletChainId();
  const contextTheme = useCustomTheme();
  const theme = props.theme || contextTheme || "dark";
  const connectionStatus = useActiveWalletConnectionStatus();
  const locale = useTWLocale();

  // preload the modal component
  useEffect(() => {
    import("./Modal/ConnectModal.js");
  }, []);

  const walletConfigs = useThirdwebProviderProps().wallets;
  const isLoading =
    connectionStatus === "connecting" || connectionStatus === "unknown";

  const connectButtonLabel =
    props.connectButton?.label || locale.connectWallet.defaultButtonTitle;

  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  const setModalConfig = useContext(SetModalConfigCtx);

  // const authConfig = useThirdwebAuthContext();
  // const { logout } = useLogout();
  // const isNetworkMismatch = useNetworkMismatch();
  const isNetworkMismatch =
    activeWalletChainId !== undefined &&
    props.chainId &&
    activeWalletChainId !== props.chainId;

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
                  ? locale.connectWallet.connecting
                  : connectButtonLabel
              }
              onClick={() => {
                let modalSize = props.connectModal?.size || "wide";

                if (!canFitWideModal() || walletConfigs.length === 1) {
                  modalSize = "compact";
                }

                setModalConfig({
                  title:
                    props.connectModal?.title ||
                    locale.connectWallet.defaultModalTitle,
                  theme,
                  data: undefined,
                  modalSize,
                  termsOfServiceUrl: props.connectModal?.termsOfServiceUrl,
                  privacyPolicyUrl: props.connectModal?.privacyPolicyUrl,
                  welcomeScreen: props.connectModal?.welcomeScreen,
                  titleIconUrl: props.connectModal?.titleIcon,
                  // auth: props.auth,
                  onConnect: props.onConnect,
                  chainId: props.chainId ? props.chainId : undefined,
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
        if (props.chainId && isNetworkMismatch) {
          return (
            <SwitchNetworkButton
              style={props.switchButton?.style}
              className={props.switchButton?.className}
              switchNetworkBtnTitle={props.switchButton?.label}
              targetChainId={props.chainId}
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
  targetChainId: number;
}) {
  const switchChain = useSwitchActiveWalletChain();
  const [switching, setSwitching] = useState(false);
  const locale = useTWLocale();

  const switchNetworkBtnTitle =
    props.switchNetworkBtnTitle ?? locale.connectWallet.switchNetwork;

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
          await switchChain(props.targetChainId);
        } catch (e) {
          console.error(e);
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
        switchNetworkBtnTitle
      )}
    </AnimatedButton>
  );
}

const AnimatedButton = /* @__PURE__ */ styled(Button)({
  animation: `${fadeInAnimation} 300ms ease`,
});
