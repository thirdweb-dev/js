import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import { getRegistrationPrice } from "../read/getRegistrationPrice.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Address } from "abitype";
/**
 * Represents the parameters for the `registerAccount` function.
 */
export type RegisterAccountParams = {
  client: ThirdwebClient;
  recoveryAddress: Address;
  extraStorage?: bigint | string | number;
  disableCache?: boolean;
};

/**
 * Registers a Farcaster account for the given wallet.
 * @param options - The options for registering an account.
 * @returns A prepared transaction object to register the account.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { registerAccount } from "thirdweb/extensions/farcaster";
 * const tx = await registerAccount({
 *  client,
 * 	recoveryAddress
 * });
 * ```
 */
export function registerAccount(
  options: BaseTransactionOptions<RegisterAccountParams>,
) {
  return prepareContractCall({
    ...options,
    method: [
      "0x6d705ebb",
      [
        {
          type: "address",
          name: "recovery",
        },
        {
          type: "uint256",
          name: "extraStorage",
        },
      ],
      [
        {
          type: "uint256",
          name: "fid",
        },
        {
          type: "uint256",
          name: "overpayment",
        },
      ],
    ],
    value: async () => {
      const price = await getRegistrationPrice({
        client: options.client,
      });
      return price;
    },
    params: [options.recoveryAddress, BigInt(options.extraStorage ?? 0)],
  });
}
