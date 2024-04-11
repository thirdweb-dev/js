import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
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
import { Spinner } from "../components/Spinner.js";
import { Button } from "../components/buttons.js";
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
    <ConnectUIContext.Provider
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
        isEmbed: false,
        connectModal: {
          ...props.connectModal,
          size:
            !canFitWideModal() || wallets.length === 1
              ? "compact"
              : props.connectModal?.size || "wide",
        },
        onConnect: props.onConnect,
      }}
    >
      <WalletUIStatesProvider theme={props.theme}>
        <ConnectButtonInner {...props} connectLocale={locale} />
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
  const theme = props.theme || "dark";
  const connectionStatus = useActiveWalletConnectionStatus();
  const locale = props.connectLocale;

  const isLoading = connectionStatus === "connecting";

  const connectButtonLabel =
    props.connectButton?.label || locale.defaultButtonTitle;

  const setIsWalletModalOpen = useSetIsWalletModalOpen();

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

  return (
    <ConnectedWalletDetails
      theme={theme}
      detailsButton={props.detailsButton}
      detailsModal={props.detailsModal}
      supportedTokens={supportedTokens}
      onDisconnect={() => {
        // no op
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
