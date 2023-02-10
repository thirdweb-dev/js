import { useEffect } from "react";
import invariant from "tiny-invariant";
import { useClient, useConnect } from "wagmi";
import { WalletConnectConnector } from "wagmi/dist/connectors/walletConnect";
import { Linking } from "react-native";
import UniversalProvider from "@walletconnect/universal-provider/dist/types/UniversalProvider";

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
  const client = useClient();
  invariant(
    client,
    `useWalletConnect() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own wallet-connection logic.`,
  );
  const { connect, connectors, error: connectError, isLoading, isSuccess } =
    useConnect();

  const walletConnector = connectors.find(
    (c) => c.id === "walletConnect",
  ) as WalletConnectConnector;
  invariant(
    walletConnector,
    "WalletConnectConnector not found, please make sure it is provided to your <ThirdwebProvider />",
  );

  useEffect(() => {
    // wagmi storage doesn't support async storage so we need to let it know that we are connected
    const getProvider = async () => {
      const provider = await walletConnector.getProvider();
      const univProvider = provider as unknown as UniversalProvider;

      if (univProvider.client.session.length > 0) {
        setTimeout(() => {
          connect({ connector: walletConnector });
        }, 100);
      }
    }

    getProvider();

    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to run this once
  }, [])

  // TO DISCUSS: There's no clear event for sending transactions.
  // const listener = useCallback((errorRP, payload) => {
  //   if (account && uri) {
  //     //Linking.openURL(uri)
  //   }
  // }, [account, uri])

  // useEffect(() => {
  //   if (!provider) {
  //     return;
  //   }
  //   provider.client.core.relayer.on("relayer_publish", listener);
  //   return () => {
  //     provider.client.core.relayer.removeListener("relayer_publish", listener);
  //   };
  // }, [provider, listener]);

  useEffect(() => {
    walletConnector.addListener('message', async ({ type, data }) => {
      switch (type) {
        case 'display_uri':
          invariant(typeof data === 'string', 'display_uri message data must be a string')
          console.log('display_uri', data);
          Linking.openURL(data);
          break;
      }
    })
    return () => {
      walletConnector.removeAllListeners();
    }
  }, [walletConnector]);

  return { connector: walletConnector, connect: () => { connect({ connector: walletConnector }) }, isLoading: isLoading, isSuccess: isSuccess, connectError }
}
