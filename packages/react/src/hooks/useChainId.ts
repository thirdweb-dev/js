import { useSigner } from "./useSigner";
import { useEffect, useState } from "react";

/**
 * Hook for accessing the chain ID of the network the current wallet is connected to
 *
 * ```javascript
 * import { useChainId } from "@thirdweb-dev/react"
 * ```
 *
 * @example
 * You can get the chain ID of the connected wallet by using the hook as follows:
 * ```javascript
 * import { useChainId } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const chainId = useChainId()
 *
 *   return <div>{chainId}</div>
 * }
 * ```
 * @public
 */
export function useChainId(): number | undefined {
  const signer = useSigner();
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  useEffect(() => {
    let s = signer;
    if (signer) {
      signer
        .getChainId()
        .then((id) => {
          // check if this is still the signr we're looking for
          if (s === signer) {
            setChainId(id);
          }
        })
        .catch((err) => {
          if (__DEV__) {
            console.warn(
              "failed to get chainId from signer in `useChainId()`",
              err,
            );
          }
        });
    } else {
      // if we don't have a signer, we don't have a a chain id
      setChainId(undefined);
    }
    return () => {
      // set the previous signer to undefined because it is invalid
      s = undefined;
    };
  }, [signer]);
  return chainId;
}
