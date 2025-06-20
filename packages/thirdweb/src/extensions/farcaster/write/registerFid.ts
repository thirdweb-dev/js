import type { Address } from "abitype";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import { toBigInt } from "../../../utils/bigint.js";
import { getIdGateway } from "../contracts/getIdGateway.js";
import { getRegistrationPrice } from "../read/getRegistrationPrice.js";

/**
 * Represents the parameters for the `registerFid` function.
 * @extension FARCASTER
 */
export type RegisterFidParams = {
  client: ThirdwebClient;
  recoveryAddress: Address;
  chain?: Chain;
  extraStorage?: bigint | string | number;
  disableCache?: boolean;
};

/**
 * Registers a Farcaster fid for the given wallet.
 * @param options - The options for registering an account.
 * @returns A prepared transaction object to register the account.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { registerFid } from "thirdweb/extensions/farcaster";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = registerFid({
 *  client,
 * 	recoveryAddress
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function registerFid(options: RegisterFidParams) {
  const extraStorage = toBigInt(options.extraStorage ?? 0);
  if (extraStorage < 0n) {
    throw new Error(
      `Expected extraStorage to be greater than or equal to 0, got ${extraStorage}`,
    );
  }

  return prepareContractCall({
    contract: getIdGateway({
      chain: options.chain,
      client: options.client,
    }),
    method: [
      "0x6d705ebb",
      [
        {
          name: "recovery",
          type: "address",
        },
        {
          name: "extraStorage",
          type: "uint256",
        },
      ],
      [
        {
          name: "fid",
          type: "uint256",
        },
        {
          name: "overpayment",
          type: "uint256",
        },
      ],
    ],
    params: [options.recoveryAddress, extraStorage],
    value: async () => {
      return await getRegistrationPrice({
        chain: options.chain,
        client: options.client,
        disableCache: options.disableCache,
        extraStorage: extraStorage,
      });
    },
  });
}
