import { providers } from "ethers";
import { matchError } from "../any-evm-constants";

/**
 * Check if a chain enforces EIP-155 transactions
 * Ref: https://eips.ethereum.org/EIPS/eip-155
 *
 * @internal
 * @param provider - The provider to use
 */
export async function isEIP155Enforced(
  provider: providers.Provider,
): Promise<boolean> {
  try {
    // TODO: Find a better way to check this.

    // Send a random transaction of legacy type (pre-eip-155).
    // It will fail. Parse the error message to check whether eip-155 is enforced.
    await provider.sendTransaction(
      "0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffafffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222",
    );
  } catch (e: any) {
    const errorMsg = e.toString().toLowerCase();
    const errorJson = JSON.stringify(e).toLowerCase();

    if (matchError(errorMsg) || matchError(errorJson)) {
      return true;
    }
    return false;
  }
  return false;
}
