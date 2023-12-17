import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { OKXWallet, getInjectedOKXProvider } from "@thirdweb-dev/wallets";
import { OKXConnectUI } from "./OKXConnectUI";

/**
 * @wallet
 */
export type OKXWalletConfigOptions = {
  /**
   * When connecting OKX using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

/**
 * A wallet configurator for [OKX Wallet](https://www.okx.com/web3) which allows integrating the wallet with React.
 *
 * It returns a `WalletConfig` object which can be used to connect the wallet to app via `ConnectWallet` component or `useConnect` hook.
 *
 * @example
 *
 * ### Usage with ConnectWallet
 *
 * To allow users to connect to this wallet using the `ConnectWallet` component, you can add it to `ThirdwebProvider`'s supportedWallets prop.
 *
 * ```tsx
 * <ThirdwebProvider supportedWallets={[okxWallet()]}>
 *  <App />
 * </ThirdwebProvider>
 * ```
 *
 * ### Usage with useConnect
 *
 * you can use the `useConnect` hook to programmatically connect to the wallet without using the `ConnectWallet` component.
 *
 * The wallet also needs to be added in `ThirdwebProvider`'s supportedWallets if you want the wallet to auto-connect on next page load.
 *
 * ```tsx
 * const okxWalletConfig = okxWallet();
 *
 * function App() {
 *   const connect = useConnect();
 *
 *   async function handleConnect() {
 *     const wallet = await connect(okxWalletConfig);
 *     console.log('connected to', wallet);
 *   }
 *
 *   return <button onClick={handleConnect}> Connect </button>;
 * }
 * ```
 *
 * @wallet
 */
export const okxWallet = (
  options?: OKXWalletConfigOptions,
): WalletConfig<OKXWallet> => {
  return {
    id: OKXWallet.id,
    recommended: options?.recommended,
    meta: {
      name: "OKX Wallet",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
        android:
          "https://play.google.com/store/apps/details?id=com.okinc.okex.gp&pli=1",
        ios: "https://apps.apple.com/us/app/okx-buy-bitcoin-eth-crypto/id1327268470",
      },
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik00Ni4wMjg0IDMyLjk2NjhIMzMuMDE5OUMzMi40Njc3IDMyLjk2NjggMzIuMDE1IDMzLjQxOTUgMzIuMDE1IDMzLjk3MTZWNDYuOTgwMUMzMi4wMTUgNDcuNTMyMyAzMi40Njc3IDQ3Ljk4NSAzMy4wMTk5IDQ3Ljk4NUg0Ni4wMjg0QzQ2LjU4MDUgNDcuOTg1IDQ3LjAzMzIgNDcuNTMyMyA0Ny4wMzMyIDQ2Ljk4MDFWMzMuOTcxNkM0Ny4wMzMyIDMzLjQxOTUgNDYuNTgwNSAzMi45NjY4IDQ2LjAyODQgMzIuOTY2OFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zMS4wMTMzIDE4SDE4LjAwNDlDMTcuNDUyNyAxOCAxNyAxOC40NTI3IDE3IDE5LjAwNDlWMzIuMDEzM0MxNyAzMi41NjU1IDE3LjQ1MjcgMzMuMDE4MiAxOC4wMDQ5IDMzLjAxODJIMzEuMDEzM0MzMS41NjU1IDMzLjAxODIgMzIuMDE4MiAzMi41NjU1IDMyLjAxODIgMzIuMDEzM1YxOS4wMDQ5QzMyLjAxNSAxOC40NTI3IDMxLjU2NTUgMTggMzEuMDEzMyAxOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik02MC45OTUyIDE4SDQ3Ljk4NjdDNDcuNDM0NSAxOCA0Ni45ODE4IDE4LjQ1MjcgNDYuOTgxOCAxOS4wMDQ5VjMyLjAxMzNDNDYuOTgxOCAzMi41NjU1IDQ3LjQzNDUgMzMuMDE4MiA0Ny45ODY3IDMzLjAxODJINjAuOTk1MkM2MS41NDczIDMzLjAxODIgNjIgMzIuNTY1NSA2MiAzMi4wMTMzVjE5LjAwNDlDNjIgMTguNDUyNyA2MS41NDczIDE4IDYwLjk5NTIgMThaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzEuMDEzMyA0Ny45MzM3SDE4LjAwNDlDMTcuNDUyNyA0Ny45MzM3IDE3IDQ4LjM4NjQgMTcgNDguOTM4NlY2MS45NDcxQzE3IDYyLjQ5OTIgMTcuNDUyNyA2Mi45NTE5IDE4LjAwNDkgNjIuOTUxOUgzMS4wMTMzQzMxLjU2NTUgNjIuOTUxOSAzMi4wMTgyIDYyLjQ5OTIgMzIuMDE4MiA2MS45NDcxVjQ4LjkzODZDMzIuMDE1IDQ4LjM4NjQgMzEuNTY1NSA0Ny45MzM3IDMxLjAxMzMgNDcuOTMzN1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik02MC45OTUyIDQ3LjkzMzdINDcuOTg2N0M0Ny40MzQ1IDQ3LjkzMzcgNDYuOTgxOCA0OC4zODY0IDQ2Ljk4MTggNDguOTM4NlY2MS45NDcxQzQ2Ljk4MTggNjIuNDk5MiA0Ny40MzQ1IDYyLjk1MTkgNDcuOTg2NyA2Mi45NTE5SDYwLjk5NTJDNjEuNTQ3MyA2Mi45NTE5IDYyIDYyLjQ5OTIgNjIgNjEuOTQ3MVY0OC45Mzg2QzYyIDQ4LjM4NjQgNjEuNTQ3MyA0Ny45MzM3IDYwLjk5NTIgNDcuOTMzN1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new OKXWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      return wallet;
    },
    connectUI: OKXConnectUI,
    isInstalled() {
      return !!getInjectedOKXProvider();
    },
  };
};
