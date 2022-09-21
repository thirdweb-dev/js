import { __DEV__ } from "../constants/runtime";
import { useSigner } from "./useSigner";
import { useEffect, useState } from "react";

/**
 * Hook for accessing the address of the connected wallet
 *
 * ```javascript
 * import { useAddress } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * To get the address of the connected wallet, you can use the hook as follows:
 *
 * ```javascript
 * import { useAddress } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const address = useAddress()
 *
 *   return <div>{address}</div>
 * }
 * ```
 *
 * The `address` variable will hold the address of the connected wallet if a user has connected using one of the supported wallet connection hooks.
 *
 * @public
 */
export function useAddress(): string | undefined {
  const signer = useSigner();
  const [address, setAddress] = useState<string | undefined>(undefined);
  useEffect(() => {
    let s = signer;
    if (signer) {
      signer
        .getAddress()
        .then((a) => {
          // check if this is still the signr we're looking for
          if (a && s === signer) {
            setAddress(a);
          }
        })
        .catch((err) => {
          if (__DEV__) {
            console.warn(
              "failed to get address from signer in `useAddress()`",
              err,
            );
          }
        });
    } else {
      // if we don't have a signer, we don't have an address
      setAddress(undefined);
    }
    return () => {
      // set the previous signer to undefined because it is invalid
      s = undefined;
    };
  }, [signer]);
  return address;
}
