import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * Hook to connect [MetaMask wallet](https://metamask.io/)
 *
 * `metamaskWallet()` needs to be added to `ThirdwebProvider`'s `supportedWallets` prop to enable auto-connection on page load
 *
 * @example
 *
 * ```jsx
 * import { useMetamask } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const connectMetaMask = useMetamask();
 *
 *   return (
 *     <button onClick={() => connectMetaMask(options)}>Connect Metamask</button>
 *   );
 * }
 * ```
 *
 * @returns function to connect to MetaMask wallet
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
 * import { useMetamask } from "@thirdweb-dev/react";
 * import { Mumbai } from "@thirdweb-dev/chains";
 *
 * function App() {
 *   const connectMetamask = useMetamask();
 *
 *   return (
 *     <button
 *       onClick={() =>
 *         connectMetamask({
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
 * @deprecated Use `ConnectWallet` component or `useConnect` hook instead
 */
export function useMetamask() {
  const connect = useConnect();
  return useCallback(
    async (options?: { chainId?: number }) => {
      const { metamaskWallet } = await import(
        "../../../wallet/wallets/metamask/metamaskWallet"
      );
      return connect(metamaskWallet(), options);
    },
    [connect],
  );
}
