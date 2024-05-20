"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { openWindow } from "../../../../../utils/web/openWindow.js";
import type { InjectedSupportedWalletIds } from "../../../../../wallets/__generated__/wallet-ids.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { wait } from "../../../../core/utils/wait.js";
import type { InjectedWalletLocale } from "../../../wallets/injected/locale/types.js";
import { ConnectingScreen } from "../../../wallets/shared/ConnectingScreen.js";

/**
 * @internal
 */
export const DeepLinkConnectUI = (props: {
  onGetStarted: () => void;
  locale: InjectedWalletLocale;
  wallet: Wallet<InjectedSupportedWalletIds>;
  walletName: string;
  deepLinkPrefix: string;
  onBack?: () => void;
}) => {
  const [errorConnecting, setErrorConnecting] = useState(false);
  const locale = props.locale;

  const handleConnect = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setErrorConnecting(false);
      const fullLink = window.location.toString().replace("https://", "");
      openWindow(`${props.deepLinkPrefix}${fullLink}`);
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [props.deepLinkPrefix]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    handleConnect();
  }, [handleConnect]);

  return (
    <ConnectingScreen
      locale={{
        getStartedLink: locale.getStartedLink,
        instruction: locale.connectionScreen.instruction,
        tryAgain: locale.connectionScreen.retry,
        inProgress: locale.connectionScreen.inProgress,
        failed: locale.connectionScreen.failed,
      }}
      onBack={props.onBack}
      walletName={props.walletName}
      onGetStarted={props.onGetStarted}
      walletId={props.wallet.id}
      onRetry={() => {
        handleConnect();
      }}
      errorConnecting={errorConnecting}
    />
  );
};
