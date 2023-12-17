import { useConnect } from "@thirdweb-dev/react-core";
import { WC2_QRModalOptions } from "@thirdweb-dev/wallets";
import { useCallback } from "react";

/**
 * @internal
 * @deprecated use the `useWalletConnect` hook instead
 */
export function useWalletConnectV1() {
  const connect = useConnect();
  return useCallback(
    async (options?: { chainId?: number }) => {
      const { walletConnectV1 } = await import(
        "../../../wallet/wallets/walletConnectV1"
      );
      return connect(walletConnectV1(), options);
    },
    [connect],
  );
}

/**
 * Hook to connect a wallet using [WalletConnect Modal](https://docs.walletconnect.com/)
 *
 * `walletConnect()` needs to be added in `ThirdwebProvider`'s `supportedWallets` to enable auto-connection on page load
 *
 * @example
 *
 * ```jsx
 * import { useWalletConnect } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const connect = useWalletConnect();
 *
 *   return (
 *     <button onClick={() => connect(options)}> Connect </button>
 *   );
 * }
 * ```
 *
 * @returns function to connect  wallet
 *
 * ### options
 *
 * ##### chainId
 *
 * To connect to a specific chain when connecting the wallet, pass the `chainId` to options object as shown below.
 *
 * This will prompt the user to switch to the given network the wallet is connected
 *
 * ```jsx
 * import { useWalletConnect } from "@thirdweb-dev/react";
 * import { Mumbai } from "@thirdweb-dev/chains";
 *
 * function App() {
 *   const connect = useWalletConnect();
 *
 *   return (
 *     <button
 *       onClick={() =>
 *         connect({
 *           chainId: Mumbai.chainId,
 *         })
 *       }
 *     >
 *       Connect Coinbase
 *     </button>
 *   );
 * }
 * ```
 *
 * you also need to add this chain in `ThirdwebProvider`'s `supportedChains` prop as shown below
 *
 * ```jsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 * import { Mumbai } from "@thirdweb-dev/chains";
 *
 * export function Example() {
 *   return (
 *     <ThirdwebProvider
 *       supportedChains={[Mumbai]}
 *       clientId="your-client-id"
 *     >
 *       <App />
 *     </ThirdwebProvider>
 *   );
 * }
 * ```
 *
 * @walletConnection
 * @deprecated use the `ConnectWallet` component or `useConnect` hook instead
 */
export function useWalletConnect() {
  const connect = useConnect();
  return useCallback(
    async (options?: {
      chainId?: number;
      projectId?: string;
      qrModalOptions?: WC2_QRModalOptions;
    }) => {
      const { walletConnect } = await import(
        "../../../wallet/wallets/walletConnect/walletConnect"
      );
      return connect(
        walletConnect({ ...options, qrModal: "walletConnect" }),
        options,
      );
    },
    [connect],
  );
}
