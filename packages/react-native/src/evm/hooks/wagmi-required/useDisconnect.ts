
import { useCallback } from "react";
import invariant from "tiny-invariant";
import { useClient, useDisconnect as useWagmiDisconnect } from "wagmi";

/**
 * Hook for disconnecting the currently connected wallet
 *
 * ```javascript
 * import { useDisconnect } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * The following will enable users to disconnect their wallet from the page.
 * ```javascript
 * import { useDisconnect } from "@thirdweb-dev/react-native"
 *
 * const App = () => {
 *   const disconnect = useDisconnect()
 *
 *   return (
 *     <Button onClick={disconnect} title={'Disconnect'} />
 *   )
 * }
 * ```
 *
 * Once users disconnect their wallet, the `useAddress`, `useChainId`, `useAccount`, and `useNetwork` hooks will no longer return values until a user connects their wallet again.
 *
 * @public
 */
export function useDisconnect() {
    const wagmiClient = useClient();
    invariant(
        wagmiClient,
        `useDisconnect() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own connection logic.`,
    );
    const { disconnect } = useWagmiDisconnect();

    const disconnectInternal = useCallback(() => {
        disconnect();
        wagmiClient.queryClient.clear();
    }, [disconnect, wagmiClient.queryClient]);

    return disconnectInternal;
}
