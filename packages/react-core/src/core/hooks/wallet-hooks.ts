import { useWalletContext } from "../providers/thirdweb-wallet-provider";
import invariant from "tiny-invariant";
import type {
  BloctoWallet,
  Coin98Wallet,
  CoinbaseWallet,
  CoreWallet,
  CryptoDefiWallet,
  EmbeddedWallet,
  FrameWallet,
  LocalWallet,
  MagicLink,
  MetaMaskWallet,
  OKXWallet,
  OneKeyWallet,
  PaperWallet,
  PhantomWallet,
  RabbyWallet,
  RainbowWallet,
  SafeWallet,
  SmartWallet,
  TokenBoundSmartWallet,
  TrustWallet,
  WalletConnect,
  walletIds,
} from "@thirdweb-dev/wallets";
import { WalletInstance } from "../types/wallet";

export type WalletId = (typeof walletIds)[keyof typeof walletIds];

export type WalletIdToWalletTypeMap = {
  metamask: MetaMaskWallet;
  coin98: Coin98Wallet;
  coinbase: CoinbaseWallet;
  coreWallet: CoreWallet;
  rainbowWallet: RainbowWallet;
  blocto: BloctoWallet;
  frame: FrameWallet;
  localWallet: LocalWallet;
  magicLink: MagicLink;
  paper: PaperWallet;
  smartWallet: SmartWallet;
  tokenBoundSmartWallet: TokenBoundSmartWallet;
  safe: SafeWallet;
  trust: TrustWallet;
  embeddedWallet: EmbeddedWallet;
  walletConnect: WalletConnect;
  phantom: PhantomWallet;
  walletConnectV1: WalletConnect;
  okx: OKXWallet;
  oneKey: OneKeyWallet;
  cryptoDefiWallet: CryptoDefiWallet;
  rabby: RabbyWallet;
};

/**
 * Hook to get the instance of the currently connected wallet.
 *
 * @example
 * ```jsx
 * import { useWallet } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const walletInstance = useWallet();
 * }
 * ```
 * @returns currently connected `WalletInstance` , or `undefined` if no wallet is connected.
 * @walletConnection
 */
export function useWallet(): WalletInstance | undefined;

/**
 * Hook to get the instance of the currently connected wallet if it matches the given `walletId`.
 *
 * @example
 * ```jsx
 * import { useWallet } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const metamaskWalletInstance = useWallet('metamask');
 * }
 * ```
 *
 * @returns currently connected `WalletInstance` with given `walletId` , or `undefined` if no wallet is connected or if the connected wallet does not match the given `walletId`.
 * @walletConnection
 */
export function useWallet<T extends WalletId>(
  walletId: T,
): WalletIdToWalletTypeMap[T] | undefined;

export function useWallet<T extends WalletId>(walletId?: T) {
  const context = useWalletContext();
  invariant(
    context,
    "useWallet() hook must be used within a <ThirdwebProvider/>",
  );

  const activeWallet = context.activeWallet;

  if (!activeWallet) {
    return undefined;
  }

  // if walletId is provided, return the wallet instance only if it matches the walletId
  if (walletId) {
    if (activeWallet.walletId === walletId) {
      return activeWallet as WalletIdToWalletTypeMap[T];
    } else {
      return undefined;
    }
  }

  return activeWallet;
}

/**
 *
 * Hook to get the `WalletConfig` object of the currently connected wallet.
 *
 * This is useful to get metadata about the connected wallet, such as the wallet name, logo, etc
 *
 * @example
 *
 * ```jsx
 * import { useWalletConfig } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const walletConfig = useWalletConfig();
 *
 *   const walletName = walletConfig?.meta.name;
 *   const walletLogo = walletConfig?.meta.iconURL;
 * }
 * ```
 *
 * @returns the current connected wallet's configuration object or `undefined` if no wallet is connected.
 *
 * @walletConnection
 */
export function useWalletConfig() {
  const context = useWalletContext();
  invariant(
    context,
    "useWallet() hook must be used within a <ThirdwebProvider/>",
  );
  return context.activeWalletConfig;
}

/**
 *
 * @returns `supportedWallets` configured in the `<ThirdwebProvider/>`
 */
export function useWallets() {
  const context = useWalletContext();
  invariant(
    context,
    "useWallets() hook must be used within a <ThirdwebProvider/>",
  );
  return context.wallets;
}

/**
 * Hook for connecting a wallet to your app.
 *
 * The wallet also needs to be added in `ThirdwebProvider`'s `supportedWallets` prop if you want the wallet to auto-connect on page load.
 *
 * @example
 *
 * ```jsx
 * import { useConnect, metamaskWallet } from "@thirdweb-dev/react";
 *
 * const metamaskConfig = metamaskWallet();
 *
 * function App() {
 *   const connect = useConnect();
 *
 *   return (
 *     <button
 *       onClick={async () => {
 *         const wallet = await connect(metamaskConfig, connectOptions);
 *         console.log("connected to ", wallet);
 *       }}
 *     >
 *       Connect to MetaMask
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns a method to connect a wallet
 * #### walletConfig
 *
 * The wallet to connect. Must be of type `WalletConfig`.
 *
 * [Learn more about the available wallet options](https://portal.thirdweb.com/react/connecting-wallets).
 *
 *
 * #### connectOptions
 *
 * The typeof `connectOptions` object depends on the wallet you are connecting. For some wallets, it may be optional
 *
 * If you are using typescript, `connect` will automatically infer the type of `connectOptions` based on the `walletConfig` you pass in as the first argument and will show type errors if you pass in invalid options.
 *
 * @walletConnection
 */
export function useConnect() {
  const context = useWalletContext();
  invariant(
    context,
    "useConnect() hook must be used within a <ThirdwebProvider/>",
  );
  return context.connect;
}

/**
 * Hook for disconnecting the currently connected wallet.
 *
 * @example
 * ```jsx
 * import { useDisconnect } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const disconnect = useDisconnect();
 *
 *   return <button onClick={disconnect}>Disconnect</button>;
 * }
 * ```
 *
 * @returns a method to disconnect from the current active wallet
 * @walletConnection
 */
export function useDisconnect() {
  const context = useWalletContext();
  invariant(
    context,
    "useDisconnect() hook must be used within a <ThirdwebProvider/>",
  );
  return context.disconnect;
}

/**
 * Hook for checking whether your app is connected to a wallet or not.
 *
 * @example
 * ```jsx
 * import { useConnectionStatus } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const connectionStatus = useConnectionStatus();
 *
 *   if (connectionStatus === "unknown") return <p> Loading... </p>;
 *   if (connectionStatus === "connecting") return <p> Connecting... </p>;
 *   if (connectionStatus === "connected") return <p> You are connected </p>;
 *   if (connectionStatus === "disconnected")
 *     return <p> You are not connected to a wallet </p>;
 * }
 * ```
 *
 * @returns the wallet connection status
 *
 * It can be one of the following:
 * - `unknown`: connection status is not known yet. This is the initial state.
 * - `connecting`: wallet is being connected. Either because of a user action, or when the wallet is auto-connecting on page load.
 * - `connected`: the wallet is connected and ready to be used.
 * - `disconnected`: the wallet is not connected.
 *
 * @walletConnection
 */
export function useConnectionStatus() {
  const context = useWalletContext();
  invariant(
    context,
    "useConnectionStatus() must be used within a <ThirdwebProvider/>",
  );
  return context.connectionStatus;
}

/**
 * Hook for setting the `connectionStatus` of the wallet which is returned by the `useConnectionStatus` hook
 *
 * This is only useful if you are manually connecting a wallet instance as mentioned in [Build your Wallet](https://portal.thirdweb.com/wallet/build-a-wallet)
 *
 * @example
 *
 * ```ts
 * import {
 *   useCreateWalletInstance,
 *   useSetConnectionStatus,
 *   useSetConnectedWallet,
 *   metamaskWallet
 * } from "@thirdweb-dev/react";
 *
 * const walletConfig = metamaskWallet();
 *
 * function Example() {
 *   const createWalletInstance = useCreateWalletInstance();
 *   const setConnectionStatus = useSetConnectionStatus();
 *   const setConnectedWallet = useSetConnectedWallet();
 *
 *   // Call this function to connect your wallet
 *   const handleConnect = async () => {
 *     // 1. create instance
 *     const walletInstance = createWalletInstance(walletConfig);
 *     setConnectionStatus("connecting");
 *
 *     try {
 *       // 2. Call `connect` method of your wallet
 *       await walletInstance.connect(
 *         connectOptions, // if your wallet.connect method accepts any options, specify it here
 *       );
 *
 *       // 3. Set connected wallet
 *       setConnectedWallet(walletInstance);
 *       props.close();
 *     } catch (e) {
 *       setConnectionStatus("disconnected");
 *       console.error("failed to connect", e);
 *     }
 *   };
 *
 *   return <div> ... </div>;
 * }
 * ```
 *
 * @returns a function that sets the `connectionStatus` of the wallet
 * @walletConnection
 */
export function useSetConnectionStatus() {
  const context = useWalletContext();
  invariant(
    context,
    "useSetConnectionStatus() must be used within a <ThirdwebProvider/>",
  );
  return context.setConnectionStatus;
}

/**
 * Hook for creating a wallet instance from given `WalletConfig` object.
 *
 * If you just want to connect the wallet and don't need the wallet instance before connecting the wallet, use the `useConnect` hook instead.
 *
 * @example
 *
 * ```jsx
 * import { useConnect, metamaskWallet } from "@thirdweb-dev/react";
 *
 * const metamaskConfig = metamaskWallet();
 *
 * function App() {
 *   const createWalletInstance = useCreateWalletInstance();
 *
 *   return (
 *     <button
 *       onClick={() => {
 *         const metamaskWalletInstance = createWalletInstance(metamaskConfig);
 *         console.log(metamaskWalletInstance);
 *       }}
 *     >
 *       create wallet instance
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns a function that creates a wallet instance for given `WalletConfig` object.
 *
 * @walletConnection
 */
export function useCreateWalletInstance() {
  const context = useWalletContext();
  invariant(
    context,
    "useCreateWalletInstance() must be used within a <ThirdwebProvider/>",
  );
  return context.createWalletInstance;
}

/**
 * Hook for switching to a different network.
 *
 * @example
 * ```jsx
 * import { useSwitchChain } from "@thirdweb-dev/react";
 * import { Goerli } from "@thirdweb-dev/chains";
 *
 * function App() {
 *   const switchChain = useSwitchChain();
 *   return (
 *     <button onClick={() => switchChain(Goerli.chainId)}>
 *       Switch to Goerli
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns a method to connect the wallet to network/chain with given `chainId`
 * @networkConnection
 */
export function useSwitchChain() {
  const context = useWalletContext();
  invariant(
    context,
    "useSwitchChain() must be used within a <ThirdwebProvider/>",
  );
  return context.switchChain;
}

/**
 * Hook for setting a wallet instance as "connected" - once done, the wallet connection hooks like `useWallet`, `useAddress`, `useSigner`, `useConnectionStatus` etc will return the data for that wallet instance
 *
 * This is only useful if you are manually connecting a wallet instance as mentioned in [Build your Wallet](https://portal.thirdweb.com/wallet/build-a-wallet)
 *
 * @example
 *
 * ```ts
 * import {
 *   useCreateWalletInstance,
 *   useSetConnectionStatus,
 *   useSetConnectedWallet,
 *   metamaskWallet
 * } from "@thirdweb-dev/react";
 *
 * const walletConfig = metamaskWallet();
 *
 * function Example() {
 *   const createWalletInstance = useCreateWalletInstance();
 *   const setConnectionStatus = useSetConnectionStatus();
 *   const setConnectedWallet = useSetConnectedWallet();
 *
 *   // Call this function to connect your wallet
 *   const handleConnect = async () => {
 *     // 1. create instance
 *     const walletInstance = createWalletInstance(walletConfig);
 *     setConnectionStatus("connecting");
 *
 *     try {
 *       // 2. Call `connect` method of your wallet
 *       await walletInstance.connect(
 *         connectOptions, // if your wallet.connect method accepts any options, specify it here
 *       );
 *
 *       // 3. Set connected wallet
 *       setConnectedWallet(walletInstance);
 *       props.close();
 *     } catch (e) {
 *       setConnectionStatus("disconnected");
 *       console.error("failed to connect", e);
 *     }
 *   };
 *
 *   return <div> ... </div>;
 * }
 * ```
 *
 * @returns a function to set a wallet instance as "connected".
 * @walletConnection
 */
export function useSetConnectedWallet() {
  const context = useWalletContext();
  invariant(
    context,
    "useSwitchChain() must be used within a <ThirdwebProvider/>",
  );
  return context.setConnectedWallet;
}
