import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { CoinbaseWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { CoinbaseConnectUI } from "./CoinbaseConnectUI";
import {
  ConnectUIProps,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";

type CoinbaseWalletOptions = {
  qrmodal?: "coinbase" | "custom";
};

export const coinbaseWallet = (
  options?: CoinbaseWalletOptions,
): WalletConfig<CoinbaseWallet> => {
  const qrmodal = options?.qrmodal || "custom";

  return {
    id: CoinbaseWallet.id,
    meta: {
      name: "Coinbase",
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMwMDUyRkYiLz4KPHBhdGggZD0iTTM5LjgyODEgNkM1OC41MTA2IDYgNzMuNjU2MiAyMS4xNDU2IDczLjY1NjIgMzkuODI4MUM3My42NTYyIDU4LjUxMDYgNTguNTEwNiA3My42NTYyIDM5LjgyODEgNzMuNjU2MkMyMS4xNDU2IDczLjY1NjIgNiA1OC41MTA2IDYgMzkuODI4MUM2IDIxLjE0NTYgMjEuMTQ1NiA2IDM5LjgyODEgNloiIGZpbGw9IiMwMDUyRkYiLz4KPHBhdGggZD0iTTM5Ljg0MjYgNTEuNTgzM0MzMy4yNjggNTEuNTgzMyAyNy45NTUxIDQ2LjI1NTkgMjcuOTU1MSAzOS42OTU4QzI3Ljk1NTEgMzMuMTM1NiAzMy4yODI1IDI3LjgwODMgMzkuODQyNiAyNy44MDgzQzQ1LjcyNzggMjcuODA4MyA1MC42MTQ4IDMyLjA5MzYgNTEuNTU0MiAzNy43MTQ1SDYzLjUyOTdDNjIuNTE3MiAyNS41MDQxIDUyLjMwMjYgMTUuOTA1OSAzOS44MjgxIDE1LjkwNTlDMjYuNjkzMSAxNS45MDU5IDE2LjAzODMgMjYuNTYwOCAxNi4wMzgzIDM5LjY5NThDMTYuMDM4MyA1Mi44MzA4IDI2LjY5MzEgNjMuNDg1NSAzOS44MjgxIDYzLjQ4NTVDNTIuMzAyNiA2My40ODU1IDYyLjUxNzIgNTMuODg3NSA2My41Mjk3IDQxLjY3N0g1MS41Mzk1QzUwLjYwMDEgNDcuMjk4IDQ1LjcyNzggNTEuNTgzMyAzOS44NDI2IDUxLjU4MzNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
        android: "https://play.google.com/store/apps/details?id=org.toshi",
        ios: "https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455",
      },
    },
    create(walletOptions: WalletOptions) {
      return new CoinbaseWallet({
        ...walletOptions,
        headlessMode: qrmodal === "custom",
      });
    },
    connectUI:
      qrmodal === "custom" ? CoinbaseConnectUI : CoinbaseNativeModalConnectUI,
    isInstalled() {
      const window_: Window | undefined = globalThis?.window;
      if (assertWindowEthereum(window_)) {
        return (
          window_.ethereum?.isCoinbaseWallet ||
          window_.ethereum?.providers?.some((p) => p.isCoinbaseWallet) ||
          false
        );
      }
      return false;
    },
  };
};

export const CoinbaseNativeModalConnectUI = ({
  close,
  walletConfig,
  open,
  supportedWallets,
  theme,
}: ConnectUIProps<CoinbaseWallet>) => {
  const createWalletInstance = useCreateWalletInstance();
  const setConnectionStatus = useSetConnectionStatus();
  const setConnectedWallet = useSetConnectedWallet();
  const prompted = useRef(false);
  const singleWallet = supportedWallets.length === 1;

  useEffect(() => {
    if (prompted.current) {
      return;
    }
    prompted.current = true;

    (async () => {
      close();
      const wallet = createWalletInstance(walletConfig);
      wallet.theme = theme;
      setConnectionStatus("connecting");
      try {
        await wallet.connect();
        setConnectedWallet(wallet);
      } catch (e) {
        setConnectionStatus("disconnected");
        if (!singleWallet) {
          open();
        }
        console.error(e);
      }
    })();
  }, [
    walletConfig,
    close,
    open,
    singleWallet,
    createWalletInstance,
    theme,
    setConnectionStatus,
    setConnectedWallet,
  ]);

  return null;
};
