import { useContext } from "react";
import { ThirdwebConnectedWalletContext } from "../contexts/thirdweb-wallet";
import type { Signer } from "ethers";
import invariant from "tiny-invariant";
import { ThirdwebWalletContext } from "../../core/providers/thirdweb-wallet-provider";

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
  const walletCtx = useContext(ThirdwebWalletContext);

  // if ThirdwebWalletContext is present, use the signer from there because signer from ThirdwebConnectedWalletContext also uses that signer but it lags behind
  // walletCtx is undefined if only ThirdwebSDKProvider is used
  if (walletCtx) {
    return walletCtx.signer;
  }

  invariant(
    context,
    "useSigner() hook must be used within a <ThirdwebProvider/> or <ThirdwebSDKProvider/> component",
  );
  return context.signer;
}
