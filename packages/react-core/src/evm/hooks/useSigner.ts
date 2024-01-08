import { useContext } from "react";
import { ThirdwebConnectedWalletContext } from "../contexts/thirdweb-wallet";
import type { Signer } from "ethers";
import invariant from "tiny-invariant";

/**
 * Hook for getting the [ethers signer](https://docs.ethers.org/v5/api/signer/) of the connected wallet.
 *
 * @example
 *
 * ```jsx
 * import { useSigner, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const signer = useSigner();
 * }
 * ```
 *
 * @returns
 *
 * `Signer` if wallet is connected, otherwise `undefined`.
 *
 * @walletConnection
 */
export function useSigner(): Signer | undefined {
  const context = useContext(ThirdwebConnectedWalletContext);
  invariant(
    context,
    "useSigner() hook must be used within a <ThirdwebProvider/>",
  );
  return context.signer;
}
