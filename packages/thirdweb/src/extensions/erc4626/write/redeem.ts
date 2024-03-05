import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { Address } from "abitype";

/**
 * Represents the parameters for the `redeem` function
 */
export type RedeemParams = {
  shares: bigint;
  receiver: Address;
  owner: Address;
};

/**
 * Redeems the specified number of shares in exchange for assets.
 * @param options - The transaction options including the receiver of returned assets, the owner of the shares to redeem, and the number of shares to redeem.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { redeem } from "thirdweb/extensions/erc4626";
 * const tx = await redeem({
 *  contract,
 *  shares: 100n,
 *  receiver: "0x...",
 *  owner: "0x...",
 * });
 * ```
 */
export function redeem(options: BaseTransactionOptions<RedeemParams>) {
  return prepareContractCall({
    ...options,
    method: [
      "0xba087652",
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
    params: [options.shares, options.receiver, options.owner],
  });
}
