import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0xfbea28c0" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "hooks",
    type: "tuple",
    internalType: "struct IERC721HookInstaller.ERC721Hooks",
    components: [
      {
        name: "beforeMint",
        type: "address",
        internalType: "address",
      },
      {
        name: "beforeTransfer",
        type: "address",
        internalType: "address",
      },
      {
        name: "beforeBurn",
        type: "address",
        internalType: "address",
      },
      {
        name: "beforeApprove",
        type: "address",
        internalType: "address",
      },
      {
        name: "beforeApproveForAll",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenURI",
        type: "address",
        internalType: "address",
      },
      {
        name: "royaltyInfo",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as const;

/**
 * Decodes the result of the getAllHooks function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetAllHooksResult } from "thirdweb/extensions/erc721";
 * const result = decodeGetAllHooksResult("...");
 * ```
 */
export function decodeGetAllHooksResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllHooks" function on the contract.
 * @param options - The options for the getAllHooks function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { getAllHooks } from "thirdweb/extensions/erc721";
 *
 * const result = await getAllHooks();
 *
 * ```
 */
export async function getAllHooks(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
