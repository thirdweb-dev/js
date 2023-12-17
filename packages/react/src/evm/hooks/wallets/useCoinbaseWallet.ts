import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * Hook to connect [Coinbase Wallet](https://www.coinbase.com/wallet)
 *
 * `coinbaseWallet()` needs to be added in `ThirdwebProvider`'s `supportedWallets` prop to enable auto-connection on page load
 *
 * ```jsx
 * import { useCoinbaseWallet } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const connectCoinbase = useCoinbaseWallet();
 *
 *   return (
 *     <button onClick={() => connectCoinbase()}>Connect Coinbase</button>
 *   );
 * }
 * ```
 *
 * @returns function to connect to Coinbase wallet
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
 * import { useCoinbaseWallet } from "@thirdweb-dev/react";
 * import { Mumbai } from "@thirdweb-dev/chains";
 *
 * function App() {
 *   const connectWithCoinbase = useCoinbaseWallet();
 *
 *   return (
 *     <button
 *       onClick={() =>
 *         connectWithCoinbase({
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
 * @walletConnection
 * @deprecated use `ConnectWallet` component or `useConnect` hook instead
 */
export function useCoinbaseWallet() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { coinbaseWallet } = await import(
        "../../../wallet/wallets/coinbase/coinbaseWallet"
      );
      return connect(coinbaseWallet(), connectOptions);
    },
    [connect],
  );
}
