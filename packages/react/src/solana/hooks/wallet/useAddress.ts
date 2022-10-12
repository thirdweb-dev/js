import { useSDK } from "../../providers/base";

/**
 * Get the currently connected wallet address
 *
 * @returns the address of the connected wallet (in base58 string format)
 */
export function useAddress() {
  const sdk = useSDK();
  return sdk?.wallet?.getAddress();
}
