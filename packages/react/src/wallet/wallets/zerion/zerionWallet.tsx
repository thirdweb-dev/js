import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { ZerionWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { ZerionConnectUI } from "./ZerionConnectUI";
import { handelWCSessionRequest } from "../handleWCSessionRequest";
import { zerionWalletUris } from "./zerionWalletUris";

export type ZerionkWalletConfigOptions = {
  /**
   * When connecting MetaMask using the QR Code - Wallet Connect connector is used which requires a project id.
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
 * A wallet configurator for [Zerion Wallet](https://zerion.io/) which allows integrating the wallet with React.
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
 * <ThirdwebProvider supportedWallets={[zerionWallet()]}>
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
 * const zerionWalletConfig = zerionWallet();
 *
 * function App() {
 *   const connect = useConnect();
 *
 *   async function handleConnect() {
 *     const wallet = await connect(zerionWalletConfig);
 *     console.log('connected to', wallet);
 *   }
 *
 *   return <button onClick={handleConnect}> Connect </button>;
 * }
 * ```
 */
export const zerionWallet = (
  options?: ZerionkWalletConfigOptions,
): WalletConfig<ZerionWallet> => {
  return {
    id: ZerionWallet.id,
    recommended: options?.recommended,
    meta: {
      ...ZerionWallet.meta,
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMyMzYxRUMiLz4KPHBhdGggZD0iTTE3LjM3OSAyMEMxNi4wMDggMjAgMTUuNDc5OCAyMS42OTUyIDE2LjYzMDEgMjIuNDAzNEw0NS40MDk0IDM5Ljc1NjJDNDYuMTI2OCA0MC4xOTc4IDQ3LjA4MzUgNDAuMDIzNCA0Ny41Nzc0IDM5LjM2MDhMNjAuMjMwOSAyMi43NDlDNjEuMDkxMiAyMS41OTUgNjAuMjIyIDIwIDU4LjczMjkgMjBIMTcuMzc5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYyLjYxMTcgNjAuMDAwMUM2My45ODI3IDYwLjAwMDEgNjQuNTI0NSA1OC4yOTU1IDYzLjM3NDMgNTcuNTg3NUwzNC41ODY4IDQwLjIzNjlDMzMuODY5NCAzOS43OTUzIDMyLjkzNTkgMzkuOTkxOSAzMi40NDIxIDQwLjY1NDNMMTkuNzY0IDU3LjI2MjlDMTguOTAzOSA1OC40MTY3IDE5LjgwMDMgNjAuMDAwMSAyMS4yODkyIDYwLjAwMDFINjIuNjExN1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new ZerionWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      handelWCSessionRequest(wallet, zerionWalletUris);

      return wallet;
    },
    connectUI: ZerionConnectUI,
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return !!globalThis.window.ethereum.isZerion;
      }
      return false;
    },
  };
};
