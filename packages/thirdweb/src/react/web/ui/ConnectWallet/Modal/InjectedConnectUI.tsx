import { useState, useCallback, useRef, useEffect } from "react";
import { wait } from "../../../../core/utils/wait.js";
import type { InjectedWalletLocale } from "../../../wallets/injected/locale/types.js";
import { ConnectingScreen } from "../../../wallets/shared/ConnectingScreen.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { InjectedSupportedWalletIds } from "../../../../../wallets/__generated__/wallet-ids.js";
import { useWalletConnectionCtx } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import type { WalletInfo } from "../../../../../wallets/wallet-info.js";

/**
 * @internal
 */
export const InjectedConnectUI = (props: {
  onGetStarted: () => void;
  locale: InjectedWalletLocale;
  wallet: Wallet<InjectedSupportedWalletIds>;
  walletInfo: WalletInfo;
  onBack?: () => void;
  done: () => void;
}) => {
  const { wallet, done } = props;
  const { client, chain } = useWalletConnectionCtx();
  const [errorConnecting, setErrorConnecting] = useState(false);
  const locale = props.locale;

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setErrorConnecting(false);
      await wait(1000);
      await wallet.connect({
        client,
        chain: chain,
      });

      done();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [client, chain, done, wallet]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    connectToExtension();
  }, [connectToExtension]);

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
      walletName={props.walletInfo.name}
      onGetStarted={props.onGetStarted}
      walletId={props.wallet.id}
      onRetry={() => {
        connectToExtension();
      }}
      errorConnecting={errorConnecting}
    />
  );
};
