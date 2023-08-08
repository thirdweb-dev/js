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
      name: "Coinbase Wallet",
      iconURL:
        "ipfs://QmcJBHopbwfJcLqJpX2xEufSS84aLbF7bHavYhaXUcrLaH/coinbase.svg",
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
