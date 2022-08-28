import { isMobile } from "../../utils/isMobile";
import { useConnect } from "../useConnect";
import invariant from "tiny-invariant";

/**
 * Hook for connecting to a Metamask wallet.
 *
 * ```javascript
 * import { useMetamask } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * We can allow users to connect their metamask wallets as follows:
 * ```javascript
 * import { useMetamask } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const connectWithMetamask = useMetamask()
 *
 *   return (
 *     <button onClick={connectWithMetamask}>
 *       Connect Metamask
 *     </button>
 *   )
 * }
 * ```
 * Here, we use the `useMetamask` hook to handle metamask connection.
 * When a user clicks the button, we'll call the `connectWithMetamask` function, which will prompt users to connect their metamask wallet.
 *
 * @public
 */
export function useMetamask() {
  const [connectors, connect] = useConnect();

  const isMetaMaskInjected =
    typeof window !== "undefined" && window.ethereum?.isMetaMask;

  const shouldUseWalletConnect = isMobile() && !isMetaMaskInjected;

  // injected connector
  const injectedConnector = connectors.data.connectors.find(
    (c) => c.id === "injected",
  );
  // walletConnect connector
  const walletConnectConnector = connectors.data.connectors.find(
    (c) => c.id === "walletConnect",
  );

  const connector =
    (shouldUseWalletConnect ? walletConnectConnector : injectedConnector) ||
    injectedConnector;

  invariant(
    connector,
    "No connector found, please make sure you provide the InjectedConnector to your <ThirdwebProvider />",
  );

  return async () => {
    // if we don't have an injected provider
    if (!isMetaMaskInjected) {
      // this is the fallback uri that should work no matter what
      const uri = `https://metamask.app.link/dapp/${window.location.toString()}`;

      // open whatever uri we end up with in a new tab
      window.open(uri, "_blank");

      return Promise.resolve({
        error: new Error("metamask not injected"),
      });
    }

    // otherwise we have MM avaiable, so we can just use it
    return await connect(connector);
  };
}
