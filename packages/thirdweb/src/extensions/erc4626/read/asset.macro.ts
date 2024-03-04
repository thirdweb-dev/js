import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";
import type { Address } from "abitype";

/**
 * Represents the parameters for retrieving the underlying asset of a tokenized vault.
 */
type AssetParams = {
  /**
   * The token vault address for which to retrieve the base asset.
   */
  vaultAddress: string;
};

/**
 * Represents the result of a balance query for an ERC20 token.
 */
type AssetResult = {
  address: Address;
};

/**
 * Retrieves the underlying ERC20 used in a tokenized vault.
 * @param options - The transaction options including the address.
 * @returns An object containing the vault's underlying token address.
 * @extension ERC4626
 * @example
 * ```ts
 * import { asset } from "thirdweb/extensions/erc20";
 *
 * const underlyingAsset = await asset({ contract, vaultAddress: "0x..." });
 * ```
 */
export async function asset(
  options: BaseTransactionOptions<AssetParams>,
): Promise<AssetResult> {
  const address = await readContract({
    ...options,
    method: $run$(() => prepareMethod("function asset() returns (address)")),
    params: [],
  });

  return {
    address,
  };
}
