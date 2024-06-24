"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { InjectedSupportedWalletIds } from "../../../../../wallets/__generated__/wallet-ids.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { wait } from "../../../../core/utils/wait.js";
import type { InjectedWalletLocale } from "../../../wallets/injected/locale/types.js";
import { ConnectingScreen } from "../../../wallets/shared/ConnectingScreen.js";

/**
 * @internal
 */
export const InjectedConnectUI = (props: {
  onGetStarted?: () => void;
  locale: InjectedWalletLocale;
  wallet: Wallet<InjectedSupportedWalletIds>;
  walletName: string;
  onBack?: () => void;
  done: () => void;
  client: ThirdwebClient;
  chain: Chain | undefined;
  size: "compact" | "wide";
}) => {
  const { wallet, done } = props;
  const [errorConnecting, setErrorConnecting] = useState(false);
  const locale = props.locale;

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setErrorConnecting(false);
      await wait(1000);
      await wallet.connect({
        client: props.client,
        chain: props.chain,
      });

      done();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [props.client, props.chain, done, wallet]);

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
      walletName={props.walletName}
      onGetStarted={props.onGetStarted}
      walletId={props.wallet.id}
      onRetry={() => {
        connectToExtension();
      }}
      errorConnecting={errorConnecting}
      client={props.client}
      size={props.size}
    />
  );
};
