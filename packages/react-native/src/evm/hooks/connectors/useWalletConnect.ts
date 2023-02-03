import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { useClient, useConnect } from "wagmi";

globalThis.Buffer = Buffer;

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
 * import { useWalletConnect } from "@thirdweb-dev/react-native"
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
  const wagmiContext = useClient();
  invariant(
    wagmiContext,
    `useWalletConnect() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own wallet-connection logic.`,
  );
  const { connect, connectors, error, isLoading, isSuccess } =
    useConnect();

  const [displayUri, setDisplayUri] = useState<string | undefined>();
  const [connectorError, setConnectorError] = useState<Error | undefined>();

  const connector = connectors.find(
    (c) => c.id === "walletConnect",
  );
  invariant(
    connector,
    "WalletConnect connector not found, please make sure it is provided to your <ThirdwebProvider />",
  );

  useEffect(() => {
    connector.addListener('message', ({ type, data }) => {
      switch (type) {
        case 'display_uri':
          invariant(typeof data === 'string', 'display_uri message data must be a string')
          setDisplayUri(data);
          break;
      }
    })
    connector.addListener('error', (connectError) => {
      setConnectorError(connectError)
    })

    return () => {
      connector.removeAllListeners();
    }
  }, [connector]);

  return { connector: connector, connect: () => { connect({ connector: connector }) }, error: error, isLoading: isLoading, isSuccess: isSuccess, displayUri, connectorError };
}

