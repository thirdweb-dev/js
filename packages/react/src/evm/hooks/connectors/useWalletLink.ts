import { useConnect } from "../wagmi-required/useConnect";
import { Buffer } from "buffer";
import invariant from "tiny-invariant";
import { useContext as useWagmiContext } from "wagmi";

globalThis.Buffer = Buffer;

/**
 * Hook for connecting to a Coinbase wallet.
 *
 * ```javascript
 * import { useCoinbaseWallet } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * We can allow users to connect with Coinbase Wallet as follows:
 * ```javascript
 * import { useCoinbaseWallet } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const connectWithCoinbaseWallet = useCoinbaseWallet()
 *
 *   return (
 *     <button onClick={connectWithCoinbaseWallet}>
 *       Connect Coinbase Wallet
 *     </button>
 *   )
 * }
 * ```
 *
 * Upon clicking this button, users will be prompted with a popup asking them scan a QR code with their Coinbase Wallet.
 * Once they scan the QR code, their wallet will then be connected to the page as expected.
 *
 * @public
 */
export function useCoinbaseWallet() {
  const wagmiContext = useWagmiContext();
  invariant(
    wagmiContext,
    `useCoinbaseWallet() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own wallet-connection logic.`,
  );
  const [connectors, connect] = useConnect();
  if (connectors.loading) {
    return () => Promise.reject("Coinbase connector not ready to be used, yet");
  }
  const connector = connectors.data.connectors.find(
    (c) => c.id === "coinbasewallet",
  );
  invariant(
    connector,
    "Coinbase connector not found, please make sure it is provided to your <ThirdwebProvider />",
  );

  return () => connect(connector);
}

/**
 * Convenience hook for connecting to a wallet via WalletLink (coinbase wallet)
 * @returns a function that will prompt the user to connect their wallet via WalletLink (coinbase wallet)
 * @internal
 */
export function useWalletLink() {
  return useCoinbaseWallet();
}
