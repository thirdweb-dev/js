import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../../wallets/wallet-info.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";

import type { InjectedWalletLocale } from "../injected/locale/types.js";

import { useCallback, useEffect, useRef, useState } from "react";
import type { COINBASE } from "../../../../wallets/constants.js";
import { ConnectingScreen } from "./ConnectingScreen.js";

/**
 * @internal
 */
function CoinbaseSDKWalletConnectUI(props: {
  onBack?: () => void;
  onGetStarted: () => void;
  done: () => void;
  locale: InjectedWalletLocale;
  wallet: Wallet<typeof COINBASE>;
  walletInfo: WalletInfo;
}) {
  const { onBack, done, wallet, walletInfo, onGetStarted, locale } = props;
  const [errorConnecting, setErrorConnecting] = useState(false);
  const { client, chain } = useConnectUI();

  const connect = useCallback(() => {
    setErrorConnecting(false);
    wallet
      .connect({
        client,
        chain,
      })
      .then(() => {
        done();
      })
      .catch((e) => {
        console.error(e);
        setErrorConnecting(true);
      });
  }, [client, wallet, chain, done]);

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;
    connect();
  }, [connect]);

  return (
    <ConnectingScreen
      locale={{
        getStartedLink: locale.getStartedLink,
        instruction: locale.connectionScreen.instruction,
        tryAgain: locale.connectionScreen.retry,
        inProgress: locale.connectionScreen.inProgress,
        failed: locale.connectionScreen.failed,
      }}
      onBack={onBack}
      walletName={walletInfo.name}
      walletId={wallet.id}
      errorConnecting={errorConnecting}
      onRetry={connect}
      onGetStarted={onGetStarted}
    />
  );
}

export default CoinbaseSDKWalletConnectUI;
