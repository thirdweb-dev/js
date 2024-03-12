import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { resolve } from "./__generated__/UniversalResolver/read/resolve.js";
import { encode } from "../../transaction/actions/encode.js";
import { prepareContractCall } from "../../transaction/prepare-contract-call.js";
import { toHex } from "../../utils/encoding/hex.js";
import { namehash } from "../../utils/ens/namehash.js";
import { packetToBytes } from "../../utils/ens/packetToBytes.js";
import { isAddress } from "../../utils/address.js";
import { LruMap } from "../../utils/caching/lru.js";
import type { Chain } from "../../chains/types.js";

export type ResolveAddressOptions = {
  client: ThirdwebClient;
  name: string;
  resolverAddress?: string;
  resolverChain?: Chain;
};

const ENS_ADDRESS_CACHE = new LruMap<string>(128);
const UNIVERSAL_RESOLVER_ADDRESS = "0xce01f8eee7E479C928F8919abD53E553a36CeF67";

/**
 * Resolves an ENS address to an Ethereum address.
 * @param options - The options for resolving an ENS address.
 * @example
 * ```ts
 * import { resolveAddress } from "thirdweb/ens";
 * const address = await resolveAddress({
 *    client,
 *    name: "vitalik.eth",
 * });
 * ```
 * @extension ENS
 * @returns A promise that resolves to the Ethereum address.
 */
export async function resolveAddress(options: ResolveAddressOptions) {
  const { client, name, resolverAddress, resolverChain } = options;
  if (isAddress(name)) {
    return name;
  }
  if (ENS_ADDRESS_CACHE.has(name)) {
    return ENS_ADDRESS_CACHE.get(name);
  }
  const contract = getContract({
    client,
    chain: resolverChain || ethereum,
    address: resolverAddress || UNIVERSAL_RESOLVER_ADDRESS,
  });
  const data = await encodeAddrCall({ contract, name });
  const result = await resolve({
    contract,
    name: toHex(packetToBytes(name)),
    data,
  });
  ENS_ADDRESS_CACHE.set(name, result[1]);
  return result[1];
}

async function encodeAddrCall(options: {
  contract: ThirdwebContract;
  name: string;
}) {
  const { contract, name } = options;
  const call = prepareContractCall({
    contract,
    method: [
      "0x3b3b57de",
      [
        {
          name: "name",
          type: "bytes32",
        },
      ],
      [
        {
          name: "",
          type: "address",
        },
      ],
    ],
    params: [namehash(name)],
  });
  return encode(call);
}
