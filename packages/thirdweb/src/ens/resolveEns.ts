import { ethereum } from "../chains/chain-definitions/ethereum.js";
import type { ThirdwebClient } from "../client/client.js";
import { getContract } from "../contract/contract.js";
import { resolve } from "../extensions/ens/__generated__/UniversalResolver/read/resolve.js";
import { toHex } from "../utils/encoding/hex.js";
import { packetToBytes } from "../utils/ens/packetToBytes.js";

export type ResolveAddressOptions = {
  client: ThirdwebClient;
  ens: string;
};

const UNIVERSAL_RESOLVER_ADDRESS = "0xce01f8eee7E479C928F8919abD53E553a36CeF67";

/**
 * @internal
 */
export async function resolveAddress(options: ResolveAddressOptions) {
  const { client, ens } = options;
  //   const rpcRequest = getRpcClient({
  //     chain: ethereum,
  //     client,
  //   });
  const contract = getContract({
    client,
    chain: ethereum,
    address: UNIVERSAL_RESOLVER_ADDRESS,
  });
  const result = await resolve({
    contract,
    name: toHex(packetToBytes(ens)),
    data: "0x",
  });
  return result[1];
}
/**
 *  ensRegistry: {
 * address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
 * },
 * ensUniversalResolver: {
 * address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
 * blockCreated: 19_258_213,
 * },
 */
