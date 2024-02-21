import { coinbaseMetadata } from "../../../wallets/coinbase/coinbaseMetadata.js";
import {
  CoinbaseSDKWallet,
  coinbaseSDKWallet,
} from "../../../wallets/coinbase/coinbaseSDKWallet.js";
import {
  coinbaseWallet,
  injectedCoinbaseProvider,
} from "../../../wallets/injected/wallets/coinbase.js";
import { useTWLocale } from "../../providers/locale-provider.js";
import type { ConnectUIProps, WalletConfig } from "../../types/wallets.js";
import { GetStartedScreen } from "../shared/GetStartedScreen.js";
import { InjectedConnectUI } from "../shared/InjectedConnectUI.js";
import { ScanScreen } from "../shared/ScanScreen.js";
import { useState, useRef, useEffect } from "react";

/**
 * Integrate Coinbase wallet connection into your app.
 * @example
 * ```tsx
 * <ThirdwebProvider
 *  client={client}>
 *  wallets={[  coinbaseConfig() ]}
 *  <App />
 * </ThirdwebProvider>
 * ```
 * @returns WalletConfig object to be passed into `ThirdwebProvider`
 */
export const coinbaseConfig = (): WalletConfig => {
  return {
    metadata: coinbaseMetadata,
    create(createOptions) {
      const isInjected = !!injectedCoinbaseProvider();
      if (isInjected) {
        return coinbaseWallet();
      } else {
        return coinbaseSDKWallet({
          appName: createOptions.dappMetadata.name,
        });
      }
    },
    connectUI: CoinbaseConnectUI,
    isInstalled() {
      return !!injectedCoinbaseProvider();
    },
  };
};

const links = {
  chrome:
    "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
  android: "https://play.google.com/store/apps/details?id=org.toshi",
  ios: "https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455",
};

function CoinbaseConnectUI(props: ConnectUIProps) {
  const isInjected = !!injectedCoinbaseProvider();
  const [screen, setScreen] = useState<"main" | "get-started">("main");
  const walletConfig = props.walletConfig;
  const locale = useTWLocale().wallets.injectedWallet(
    walletConfig.metadata.name,
  );

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        locale={{
          scanToDownload: locale.getStartedScreen.instruction,
        }}
        walletIconURL={walletConfig.metadata.iconUrl}
        walletName={walletConfig.metadata.name}
        chromeExtensionLink={links.chrome}
        googlePlayStoreLink={links.android}
        appleStoreLink={links.ios}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  }

  if (isInjected) {
    return (
      <InjectedConnectUI
        {...props}
        onGetStarted={() => {
          setScreen("get-started");
        }}
      />
    );
  }

  return (
    <CoinbaseSDKWalletConnectUI
      connectUIProps={props}
      onGetStarted={() => {
        setScreen("get-started");
      }}
    />
  );
}

function CoinbaseSDKWalletConnectUI(props: {
  connectUIProps: ConnectUIProps;
  onGetStarted: () => void;
}) {
  const { connectUIProps, onGetStarted } = props;
  const locale = useTWLocale().wallets.injectedWallet(
    connectUIProps.walletConfig.metadata.name,
  );
  const { createInstance, done, chain } = connectUIProps.connection;
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);

  const scanStarted = useRef(false);

  useEffect(() => {
    if (scanStarted.current) {
      return;
    }

    scanStarted.current = true;

    (async () => {
      const wallet = createInstance() as CoinbaseSDKWallet;

      try {
        await wallet.connect({
          reloadOnDisconnect: false,
          chain: chain ? chain : undefined,
          onUri(uri) {
            if (uri) {
              setQrCodeUri(uri);
            } else {
              // show error
            }
          },
          headlessMode: true,
        });

        done(wallet);
      } catch {
        // show error
      }
    })();
  }, [chain, createInstance, done]);

  return (
    <ScanScreen
      qrScanInstruction={locale.scanScreen.instruction}
      onBack={connectUIProps.screenConfig.goBack}
      onGetStarted={onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={connectUIProps.walletConfig.metadata.name}
      walletIconURL={connectUIProps.walletConfig.metadata.iconUrl}
      getStartedLink={locale.getStartedLink}
    />
  );
}
