import { useCallback, useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../../wallets/wallet-info.js";
import type { InjectedWalletLocale } from "../injected/locale/types.js";
import { ConnectingScreen } from "./ConnectingScreen.js";

/**
 * @internal
 */
function ExternalWalletConnectUI(props: {
  onBack?: () => void;
  onGetStarted: () => void;
  done: () => void;
  locale: InjectedWalletLocale;
  wallet: Wallet;
  walletInfo: WalletInfo;
  client: ThirdwebClient;
  chain: Chain | undefined;
  size: "compact" | "wide";
}) {
  const { onBack, done, wallet, walletInfo, onGetStarted, locale } = props;
  const [errorConnecting, setErrorConnecting] = useState(false);

  const connect = useCallback(() => {
    setErrorConnecting(false);
    wallet
      .connect({
        chain: props.chain,
        client: props.client,
      })
      .then(() => {
        done();
      })
      .catch((e) => {
        console.error(e);
        setErrorConnecting(true);
      });
  }, [props.client, wallet, props.chain, done]);

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
      client={props.client}
      errorConnecting={errorConnecting}
      locale={{
        failed: locale.connectionScreen.failed,
        getStartedLink: locale.getStartedLink,
        inProgress: locale.connectionScreen.inProgress,
        instruction: locale.connectionScreen.instruction,
        tryAgain: locale.connectionScreen.retry,
      }}
      onBack={onBack}
      onGetStarted={onGetStarted}
      onRetry={connect}
      size={props.size}
      walletId={wallet.id}
      walletName={walletInfo.name}
    />
  );
}

export default ExternalWalletConnectUI;
