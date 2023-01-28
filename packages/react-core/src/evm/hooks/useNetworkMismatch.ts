import { useSDK } from "../providers/base";
import { useChainId } from "./wallet";
import { useQuery } from "@tanstack/react-query";
import { RPCConnectionHandler } from "@thirdweb-dev/sdk/dist/declarations/src/evm/core/classes/rpc-connection-handler";
import { useEffect } from "react";

/**
 * Hook for checking whether the connected wallet is on the correct network specified by the `desiredChainId` passed to the `<ThirdwebProvider />`.
 *
 * ```javascript
 * import { useNetworkMistmatch } from "@thirdweb-dev/react"
 * ```
 *
 * @returns `true` if the chainId of the connected wallet is different from the chainId of the network passed into <ThirdwebProvider />
 *
 * @example
 * You can check if a users wallet is connected to the correct chain ID as follows:
 * ```javascript
 * import { useNetworkMismatch } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const isMismatched = useNetworkMismatch()
 *
 *   return <div>{isMismatched}</div>
 * }
 * ```
 *
 * From here, you can prompt users to switch their network using the `useNetwork` hook.
 *
 * @public
 */
export function useNetworkMismatch(contract?: RPCConnectionHandler) {
  const walletChainId = useChainId();
  const sdk = useSDK();

  // if a contract is passed in, we want to check against that contract's chainId, otherwise we want to check against the SDK's chainId
  const checkAgainst = contract ?? sdk;

  const chainIdQuery = useQuery({
    queryKey: ["sdk", "chainId"],
    queryFn: async () => {
      if (checkAgainst) {
        return (await checkAgainst?.getProvider().getNetwork()).chainId;
      }
      return -1;
    },
    enabled: !!sdk,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: -1,
  });

  useEffect(() => {
    chainIdQuery.refetch();
    // we just want to do this when the SDK changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkAgainst]);

  if (!chainIdQuery.data) {
    // async so we don't know yet
    return false;
  }

  if (chainIdQuery.data === -1) {
    // means no desiredChainId is set in the <ThirdwebProvider />, so we don't care about the network mismatch
    return false;
  }
  if (!walletChainId) {
    // means no wallet is connected yet, so we don't care about the network mismatch
    return false;
  }
  // check if the chainIds are different
  return chainIdQuery.data !== walletChainId;
}
