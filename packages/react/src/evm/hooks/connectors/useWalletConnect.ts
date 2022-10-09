import { useConnect } from "../wagmi-required/useConnect";
import invariant from "tiny-invariant";
import { useContext as useWagmiContext } from "wagmi";

if (!globalThis.Buffer) {
  globalThis.Buffer = require("buffer/").Buffer;
}
/**
 * Hook for connecting to a mobile wallet with Wallet Connect
 *
 * ```javascript
 * import { useWalletConnect } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * We can allows user to connect their mobile wallets as follows:
 * ```javascript
 * import { useWalletConnect } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const connectWithWalletConnect = useWalletConnect()
 *
 *   return (
 *     <button onClick={connectWithWalletConnect}>
 *       Connect WalletConnect
 *     </button>
 *   )
 * }
 * ```
 *
 * When users click this button, a popup will appear on the screen prompting them to scan a QR code from their phone to connect their mobile wallets.
 * Once they scan the QR code from a wallet connect supported mobile wallet, their wallet will then be connected to the page as expected.
 *
 * @public
 */
export function useWalletConnect() {
  const wagmiContext = useWagmiContext();
  invariant(
    wagmiContext,
    `useWalletConnect() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own wallet-connection logic.`,
  );
  const [connectors, connect] = useConnect();
  if (connectors.loading) {
    return () =>
      Promise.reject("WalletConnect connector not ready to be used, yet");
  }
  const connector = connectors.data.connectors.find(
    (c) => c.id === "walletConnect",
  );
  invariant(
    connector,
    "WalletConnect connector not found, please make sure it is provided to your <ThirdwebProvider />",
  );

  return () => connect(connector);
}
