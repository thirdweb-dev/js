import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { Address } from "abitype";

/**
 * Represents the parameters for the `withdraw` function
 */
export type WithdrawParams = {
  assets: bigint;
  receiver: Address;
  owner: Address;
};

/**
 * Withdraws the specified number of assets in exchange for shares.
 * @param options - The transaction options including the receiver of withdrawn assets, the owner of shares to return, and the number of assets to withdraw.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { withdraw } from "thirdweb/extensions/erc4626";
 * const tx = await withdraw({
 *  contract,
 *  assets: 100n,
 *  receiver: "0x...",
 *  owner: "0x...",
 * });
 * ```
 */
export function deposit(options: BaseTransactionOptions<WithdrawParams>) {
  return prepareContractCall({
    ...options,
    method: [
      "0xb460af94",
      [
        {
          type: "uint256",
        },
        {
          type: "address",
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
    params: [options.assets, options.receiver, options.owner],
  });
}
