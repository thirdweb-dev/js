import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { Address } from "abitype";

/**
 * Represents the parameters for the `deposit` function
 */
export type DepositParams = {
  assets: bigint;
  receiver: Address;
};

/**
 * Mints the corresponding number of Vault shares for the assets provided.
 * @param options - The transaction options including the receiver and the number of assets to deposit.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { deposit } from "thirdweb/extensions/erc4626";
 * const tx = await deposit({
 *  contract,
 *  receiver: "0x...",
 *  assets: 100n,
 * });
 * ```
 */
export function deposit(options: BaseTransactionOptions<DepositParams>) {
  return prepareContractCall({
    ...options,
    method: [
      "0x6e553f65",
      [
        {
          type: "uint256",
        },
        {
          type: "address",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.assets, options.receiver],
  });
}
