import UniversalProvider from "@walletconnect/universal-provider/dist/types/UniversalProvider";
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import invariant from "tiny-invariant";
import { useClient, useConnect, useDisconnect } from "wagmi";
import { WalletConnectConnector } from "wagmi/dist/connectors/walletConnect";

/**
 * Hook for connecting to a mobile wallet with Wallet Connect
 *
 * ```javascript
 * import { useWalletConnect } from "@thirdweb-dev/react-native"
 * ```
 *
 *
 * @example
 * We can allow user to connect their mobile wallets as follows:
 * ```javascript
 * import { useWalletConnect } from "@thirdweb-dev/react-native"
 *
 * const App = () => {
 *   const {connect} = useWalletConnect()
 *
 *   return (
 *     <Button onClick={connect} title={'Connect Wallet'} />
 *   )
 * }
 * ```
 *
 * Android: `connect` will trigger a modal with a list of available wallets to connect to on their device.
 * iOS: `connect` will try to open the first app available to handle `wc://` links on the device.
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

  const {
    connect,
    connectors,
    error: wagmiConnectError,
    isLoading,
    isSuccess,
  } = useConnect();

  const walletConnector = connectors.find(
    (c) => c.id === "walletConnect",
  ) as WalletConnectConnector;
  invariant(
    walletConnector,
    "WalletConnectConnector not found, please make sure it is provided to your <ThirdwebProvider />",
  );

  const { disconnect } = useDisconnect();

  useEffect(() => {
    setConnectError(wagmiConnectError);
  }, [wagmiConnectError]);

  useEffect(() => {
    // wagmi storage doesn't support async storage on mobile, so we need to manually connect
    // https://github.com/wagmi-dev/wagmi/discussions/1630
    const getProvider = async () => {
      const provider = await walletConnector.getProvider();
      const univProvider = provider as unknown as UniversalProvider;

      // waiting on wagmi to update the latest universal provider (tag 2.4.2)
      // univProvider.client.on('session_request_sent', ({ topic, request, chainId }) => {
      //   // redirect to wallet
      //   Linking.openURL(displayUri);
      // });

      if (univProvider.client.session.length > 0) {
        // wc client does not report a successful initialization,
        // so we need to wait for it to initialize before connecting
        setTimeout(() => {
          connect({ connector: walletConnector });
        }, 100);
      }
    };

    getProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to run this once
  }, []);

  useEffect(() => {
    walletConnector.addListener("message", async ({ type, data }) => {
      switch (type) {
        case "display_uri":
          invariant(
            typeof data === "string",
            "display_uri message data must be a string",
          );
          // store first part of the uri to trigger wallet connect
          setDisplayUri(data);
          Linking.openURL(data);
          break;
      }
    });

    walletConnector.addListener("connect", () => {
      console.log("walletConnector connect");
    });

    walletConnector.addListener("disconnect", () => {
      // we need to disconnect wagmi when the connector disconnects
      disconnect();
    });
    return () => {
      walletConnector.removeAllListeners();
    };
  }, [disconnect, walletConnector]);

  return {
    connector: walletConnector,
    connect: () => {
      connect({ connector: walletConnector });
    },
    isLoading: isLoading,
    isSuccess: isSuccess,
    connectError,
    displayUri,
  };
}
