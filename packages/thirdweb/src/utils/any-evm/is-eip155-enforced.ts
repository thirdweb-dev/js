import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { eth_sendRawTransaction } from "../../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../../rpc/rpc.js";

// it's OK to cache this forever because:
// 1. the results can't change
// 2. the total size can be max <number of chains> * boolean
const EIP_ENFORCED_CACHE = new Map<number, boolean>();

type IsEIP155EnforcedOptions = {
  chain: Chain;
  client: ThirdwebClient;
};

/**
 * Checks whether EIP-155 is enforced by sending a random transaction of legacy type (pre-EIP-155)
 * and parsing the error message.
 * @param options - The options for checking EIP-155 enforcement.
 * @returns A promise that resolves to a boolean indicating whether EIP-155 is enforced.
 * @example
 * ```ts
 * import { isEIP155Enforced } from "thirdweb/utils";
 * const isEIP155 = await isEIP155Enforced({ chain, client });
 * ```
 * @utils
 */
export async function isEIP155Enforced(
  options: IsEIP155EnforcedOptions,
): Promise<boolean> {
  const chainId = options.chain.id;
  // cache because the result cannot change
  if (EIP_ENFORCED_CACHE.has(chainId)) {
    return EIP_ENFORCED_CACHE.get(chainId) as boolean;
  }
  let result = false;
  try {
    // TODO: Find a better way to check this.

    // Send a random transaction of legacy type (pre-eip-155).
    // It will fail. Parse the error message to check whether eip-155 is enforced.
    const rpcRequest = getRpcClient(options);
    await eth_sendRawTransaction(
      rpcRequest,
      "0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffafffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222",
    );
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  } catch (e: any) {
    const errorMsg = e.toString().toLowerCase();
    const errorJson = JSON.stringify(e).toLowerCase();

    if (matchError(errorMsg) || matchError(errorJson)) {
      result = true;
    }
  }
  EIP_ENFORCED_CACHE.set(chainId, result);
  return result;
}

const ERROR_SUBSTRINGS_COMPOSITE = [
  ["account", "not found"],
  ["wrong", "chainid"],
];
const ERROR_SUBSTRINGS = [
  "eip-155",
  "eip155",
  "protected",
  "invalid chain id for signer",
  "chain id none",
  "chain_id mismatch",
  "recovered sender mismatch",
  "transaction hash mismatch",
  "chainid no support",
  "chainid (0)",
  "chainid(0)",
];

function matchError(error: string): boolean {
  const hasError = ERROR_SUBSTRINGS.some((substring) =>
    error.includes(substring),
  );
  // can early exit if we find a match
  if (hasError) {
    return true;
  }

  // otherwise return true if any of the composite substrings are found
  return ERROR_SUBSTRINGS_COMPOSITE.some((arr) => {
    return arr.some((substring) => error.includes(substring));
  });
}
