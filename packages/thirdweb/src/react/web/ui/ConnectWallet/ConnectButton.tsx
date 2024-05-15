"use client";

import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { useSiweAuth } from "../../../core/hooks/auth/useSiweAuth.js";
import { AutoConnect } from "../../../core/hooks/connection/useAutoConnect.js";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "../../../core/hooks/wallets/wallet-hooks.js";
import { ConnectUIContext } from "../../../core/providers/wallet-connection.js";
import {
  WalletUIStatesProvider,
  useSetIsWalletModalOpen,
} from "../../providers/wallet-ui-states-provider.js";
import { canFitWideModal } from "../../utils/canFitWideModal.js";
import { getDefaultWallets } from "../../wallets/defaultWallets.js";
import { Modal } from "../components/Modal.js";
import { Spinner } from "../components/Spinner.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { iconSize } from "../design-system/index.js";
import type { ConnectButtonProps } from "./ConnectButtonProps.js";
import { ConnectedWalletDetails } from "./Details.js";
import ConnectModal from "./Modal/ConnectModal.js";
import { defaultTokens } from "./defaultTokens.js";
import { LockIcon } from "./icons/LockIcon.js";
import { useConnectLocale } from "./locale/getConnectLocale.js";
import type { ConnectLocale } from "./locale/types.js";
import { SignatureScreen } from "./screens/SignatureScreen.js";

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
  const wallets = useMemo(
    () =>
      props.wallets ||
      getDefaultWallets({
        appMetadata: props.appMetadata,
        chains: props.chains,
      }),
    [props.wallets, props.appMetadata, props.chains],
  );
  const localeQuery = useConnectLocale(props.locale || "en_US");

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
      onConnect={props.onConnect}
    />
  );

  if (!localeQuery.data) {
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
    <ConnectUIContext.Provider
      value={{
        appMetadata: props.appMetadata,
        client: props.client,
        wallets: wallets,
        locale: props.locale || "en_US",
        connectLocale: localeQuery.data,
        chain: props.chain || props.accountAbstraction?.chain,
        chains: props.chains,
        walletConnect: props.walletConnect,
        accountAbstraction: props.accountAbstraction,
        recommendedWallets: props.recommendedWallets,
        showAllWallets: props.showAllWallets,
        isEmbed: false,
        connectModal: {
          ...props.connectModal,
          size:
            !canFitWideModal() || wallets.length === 1
              ? "compact"
              : props.connectModal?.size || "wide",
        },
        onConnect: props.onConnect,
        auth: props.auth,
      }}
    >
      <WalletUIStatesProvider theme={props.theme}>
        <ConnectButtonInner {...props} connectLocale={localeQuery.data} />
        <ConnectModal />
        {autoConnectComp}
      </WalletUIStatesProvider>
    </ConnectUIContext.Provider>
  );
}

function ConnectButtonInner(
  props: ConnectButtonProps & {
    connectLocale: ConnectLocale;
  },
) {
  const activeAccount = useActiveAccount();
  const siweAuth = useSiweAuth(props.auth);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

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

  if (siweAuth.requiresAuth) {
    // loading state if loading
    // TODO: figure out a way to consolidate the loading states with the ones from locale loading
    if (siweAuth.isLoading) {
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
          <Spinner size="sm" color="primaryButtonText" />
        </AnimatedButton>
      );
    }
    // sign in button + modal if *not* loading and *not* logged in
    if (!siweAuth.isLoggedIn) {
      return (
        <>
          <Button
            variant="primary"
            type="button"
            onClick={() => {
              setShowSignatureModal(true);
            }}
            className={props.signInButton?.className}
            style={{
              minWidth: "140px",
              ...props.signInButton?.style,
            }}
          >
            {siweAuth.isLoggingIn ? (
              <Spinner size="sm" color="primaryButtonText" />
            ) : (
              <Container flex="row" center="y" gap="sm">
                <LockIcon size={iconSize.sm} />
                <span> {props.signInButton?.label || locale.signIn} </span>
              </Container>
            )}
          </Button>
          <Modal
            size="compact"
            open={showSignatureModal}
            setOpen={setShowSignatureModal}
          >
            <SignatureScreen
              client={props.client}
              connectLocale={locale}
              modalSize="compact"
              termsOfServiceUrl={props.connectModal?.termsOfServiceUrl}
              privacyPolicyUrl={props.connectModal?.privacyPolicyUrl}
              onDone={() => setShowSignatureModal(false)}
              auth={props.auth}
            />
          </Modal>
        </>
      );
    }
    // otherwise, show the details button
  }

  return (
    <ConnectedWalletDetails
      theme={theme}
      detailsButton={props.detailsButton}
      detailsModal={props.detailsModal}
      supportedTokens={supportedTokens}
      onDisconnect={() => {
        // logout on explicit disconnect!
        if (siweAuth.requiresAuth) {
          siweAuth.doLogout();
        }
      }}
      chains={props?.chains || []}
      chain={props.chain}
      switchButton={props.switchButton}
    />
  );
}

const AnimatedButton = /* @__PURE__ */ styled(Button)({
  animation: `${fadeInAnimation} 300ms ease`,
});
