import { useThirdwebConnectedWalletContext } from "../contexts/thirdweb-wallet";
import type { Signer } from "ethers";

/**
 *
 * @internal
 */
export function useSigner(): Signer | undefined {
  return useThirdwebConnectedWalletContext().signer;
}
