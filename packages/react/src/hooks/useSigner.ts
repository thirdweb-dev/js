import { useSDK } from "../providers/base";
import type { Signer } from "ethers";
import { useEffect, useState } from "react";

/**
 *
 * @internal
 */
export function useSigner(): Signer | undefined {
  const sdk = useSDK();
  const [signer, setSigner] = useState<Signer | undefined>(sdk?.getSigner());
  useEffect(() => {
    if (sdk) {
      sdk.wallet.events.on("signerChanged", (newSigner: Signer | undefined) => {
        setSigner(newSigner);
      });
      return () => {
        sdk.wallet.events.off("signerChanged");
      };
    }
  }, [sdk]);
  return signer;
}
