import { useContext } from "react";
import { ThirdwebConnectedWalletContext } from "../contexts/thirdweb-wallet";
import type { Signer } from "ethers";
import invariant from "tiny-invariant";

/**
 *
 * @internal
 */
export function useSigner(): Signer | undefined {
  const context = useContext(ThirdwebConnectedWalletContext);
  invariant(
    context,
    "useSigner() hook must be used within a <ThirdwebProvider/>",
  );
  return context.signer;
}
