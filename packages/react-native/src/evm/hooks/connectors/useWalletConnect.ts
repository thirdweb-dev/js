import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { useClient, useConnect } from "wagmi";
import { WalletConnectConnector } from "wagmi/dist/connectors/walletConnect";
import { Linking } from "react-native";
import UniversalProvider from "@walletconnect/universal-provider/dist/types/UniversalProvider";
import { useDisconnect } from "../wagmi-required/useDisconnect";

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
  const [displayUri, setDisplayUri] = useState<string | undefined>();
  const [connectError, setConnectError] = useState<Error | null>();
  const { connect, connectors, error: wagmiConnectError, isLoading, isSuccess } =
    useConnect();

  const walletConnector = connectors.find(
    (c) => c.id === "walletConnect",
  ) as WalletConnectConnector;
  invariant(
    walletConnector,
    "WalletConnectConnector not found, please make sure it is provided to your <ThirdwebProvider />",
  );

  const disconnect = useDisconnect();

  useEffect(() => {
    setConnectError(wagmiConnectError);
  }, [wagmiConnectError]);

  useEffect(() => {
    // wagmi storage doesn't support async storage so we need to let it know that we are connected
    const getProvider = async () => {
      const provider = await walletConnector.getProvider();
      const univProvider = provider as unknown as UniversalProvider;

      // waiting on wagmi to update to latest universal provider
      // univProvider.client.on('session_request_sent', ({ topic, request, chainId }) => {
      //   // redirect to wallet
      //   Linking.openURL(displayUri);
      // });

      if (univProvider.client.session.length > 0) {
        console.log('peer', univProvider.client.session.values[0].peer);
        setTimeout(() => {
          connect({ connector: walletConnector });
        }, 100);
      }
    }

    getProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to run this once
  }, [])

  useEffect(() => {
    walletConnector.addListener('message', async ({ type, data }) => {
      switch (type) {
        case 'display_uri':
          invariant(typeof data === 'string', 'display_uri message data must be a string')
          console.log('display_uri', data);
          // store first part of the uri to trigger wallet connect
          setDisplayUri(data.split('?')[0]);
          Linking.openURL(data);
          break;
      }
    })

    walletConnector.addListener('disconnect', () => {
      console.log('disconnect');
      disconnect();
    })
    return () => {
      walletConnector.removeAllListeners();
    }
  }, [disconnect, walletConnector]);

  return { connector: walletConnector, connect: () => { connect({ connector: walletConnector }) }, isLoading: isLoading, isSuccess: isSuccess, connectError, displayUri }
}
