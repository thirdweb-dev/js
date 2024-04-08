import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import { toBigInt } from "../../../utils/bigint.js";
import { getStorageRegistry } from "../contracts/getStorageRegistry.js";
import { getStoragePrice } from "../read/getStoragePrice.js";

/**
 * Represents the parameters for the `rentStorage` function.
 */
export type RentStorageParams = {
  client: ThirdwebClient;
  fid: bigint | number | string;
  units?: bigint | number | string;
  chain?: Chain;
  disableCache?: boolean;
};

/**
 * Rent storage for the provided farcaster fid.
 * @param options - The options for calling the `rentStorage` function.
 * @returns A prepared transaction object to rent the storage.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { rentStorage } from "thirdweb/extensions/farcaster";
 * const tx = await rentStorage({
 *  client,
 * 	fid,
 *  units,
 * });
 * ```
 */
export function rentStorage(options: RentStorageParams) {
  const units = toBigInt(options.units ?? 1);
  if (units < 1n) {
    throw new Error(
      `Expected units to be greater than or equal to 1, got ${options.units}`,
    );
  }

  const fid = toBigInt(options.fid);

  return prepareContractCall({
    contract: getStorageRegistry({
      client: options.client,
      chain: options.chain,
    }),
    method: [
      "0x783a112b",
      [
        {
          type: "uint256",
          name: "fid",
        },
        {
          type: "uint256",
          name: "units",
        },
      ],
      [
        {
          type: "uint256",
          name: "overpayment",
        },
      ],
    ],
    value: async () => {
      const price = await getStoragePrice({
        client: options.client,
        chain: options.chain,
        units,
      });
      return price;
    },
    params: [fid, units],
  });
}
