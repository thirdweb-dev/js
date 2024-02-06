import { useCallback, useEffect, useRef, useState } from "react";
import { useTWLocale } from "../../providers/locale-provider.js";
import type { ConnectUIProps } from "../../types/wallets.js";
import { ConnectingScreen } from "./ConnectingScreen.js";
import { wait } from "../../utils/wait.js";

/**
 * @internal
 */
export const InjectedConnectUI = (
  props: ConnectUIProps & {
    onGetStarted: () => void;
  },
) => {
  const locale = useTWLocale().wallets.injectedWallet(
    props.walletConfig.metadata.name,
  );

  const { walletConfig, done, screenConfig, createInstance } = props;
  const [errorConnecting, setErrorConnecting] = useState(false);

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setErrorConnecting(false);
      await wait(1000);
      const wallet = createInstance();
      const account = await wallet.connect({
        chainId: props.chainId,
      });
      done(account);
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [createInstance, done, props.chainId]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    connectToExtension();
  }, [walletConfig, connectToExtension]);

  return (
    <ConnectingScreen
      locale={{
        getStartedLink: locale.getStartedLink,
        instruction: locale.connectionScreen.instruction,
        tryAgain: locale.connectionScreen.retry,
        inProgress: locale.connectionScreen.inProgress,
        failed: locale.connectionScreen.failed,
      }}
      onBack={screenConfig.goBack}
      walletName={walletConfig.metadata.name}
      walletIconURL={walletConfig.metadata.iconUrl}
      onGetStarted={props.onGetStarted}
      onRetry={() => {
        connectToExtension();
      }}
      errorConnecting={errorConnecting}
    />
  );
};
