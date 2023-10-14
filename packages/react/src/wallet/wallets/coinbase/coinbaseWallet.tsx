import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import {
  CoinbaseWallet,
  getInjectedCoinbaseProvider,
} from "@thirdweb-dev/wallets";
import { CoinbaseConnectUI } from "./CoinbaseConnectUI";
import {
  ConnectUIProps,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";

type CoinbaseWalletOptions = {
  /**
   * Whether to use the Coinbase's default QR Code modal or show the custom UI in ConnectWallet Modal
   * @default "custom"
   */
  qrmodal?: "coinbase" | "custom";

  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export const coinbaseWallet = (
  options?: CoinbaseWalletOptions,
): WalletConfig<CoinbaseWallet> => {
  const qrmodal = options?.qrmodal || "custom";

  return {
    id: CoinbaseWallet.id,
    recommended: options?.recommended,
    meta: {
      name: "Coinbase Wallet",
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzA1NTVGRiIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMzMwM184NjM0KSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuMzMxMiA0SDM1LjY2NzJDNDAuMjcwNCA0IDQ0IDguMDEyOCA0NCAxMi45NjMyVjM1LjAzNjhDNDQgMzkuOTg3MiA0MC4yNzA0IDQ0IDM1LjY2ODggNDRIMTIuMzMxMkM3LjcyOTYgNDQgNCAzOS45ODcyIDQgMzUuMDM2OFYxMi45NjMyQzQgOC4wMTI4IDcuNzI5NiA0IDEyLjMzMTIgNFoiIGZpbGw9IiMwMDUyRkYiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNC4wMDAzIDkuNzkzNDZDMzEuODQ2NyA5Ljc5MzQ2IDM4LjIwNjcgMTYuMTUzNSAzOC4yMDY3IDIzLjk5OTlDMzguMjA2NyAzMS44NDYzIDMxLjg0NjcgMzguMjA2MyAyNC4wMDAzIDM4LjIwNjNDMTYuMTUzOSAzOC4yMDYzIDkuNzkzOTUgMzEuODQ2MyA5Ljc5Mzk1IDIzLjk5OTlDOS43OTM5NSAxNi4xNTM1IDE2LjE1MzkgOS43OTM0NiAyNC4wMDAzIDkuNzkzNDZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIwLjUwMDYgMTkuNDU5SDI3LjQ5NzRDMjguMDczNCAxOS40NTkgMjguNTM5IDE5Ljk2MTQgMjguNTM5IDIwLjU3OVYyNy40MTlDMjguNTM5IDI4LjAzODIgMjguMDcxOCAyOC41MzkgMjcuNDk3NCAyOC41MzlIMjAuNTAwNkMxOS45MjQ2IDI4LjUzOSAxOS40NTkgMjguMDM2NiAxOS40NTkgMjcuNDE5VjIwLjU3OUMxOS40NTkgMTkuOTYxNCAxOS45MjYyIDE5LjQ1OSAyMC41MDA2IDE5LjQ1OVoiIGZpbGw9IiMwMDUyRkYiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMzAzXzg2MzQiPgo8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0IDQpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
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
      return !!getInjectedCoinbaseProvider();
    },
  };
};

export const CoinbaseNativeModalConnectUI = ({
  connected,
  walletConfig,
  show,
  hide,
  supportedWallets,
  theme,
  goBack,
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
      hide();
      const wallet = createWalletInstance(walletConfig);
      wallet.theme = theme;
      setConnectionStatus("connecting");
      try {
        await wallet.connect();
        setConnectedWallet(wallet);
        connected();
      } catch (e) {
        setConnectionStatus("disconnected");
        if (!singleWallet) {
          goBack();
          show();
        }
        console.error(e);
      }
    })();
  }, [
    walletConfig,
    singleWallet,
    createWalletInstance,
    theme,
    setConnectionStatus,
    setConnectedWallet,
    hide,
    connected,
    goBack,
    show,
  ]);

  return null;
};
