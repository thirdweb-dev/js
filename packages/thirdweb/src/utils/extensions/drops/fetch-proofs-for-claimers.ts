import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import {
  isNativeTokenAddress,
  ZERO_ADDRESS,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { MerkleTree } from "../../../merkletree/MerkleTree.js";
import { download } from "../../../storage/download.js";
import type { Address } from "../../address.js";
import type { Hex } from "../../encoding/hex.js";
import { convertQuantity } from "./convert-quantity.js";
import { hashEntry } from "./hash-entry.js";
import type {
  OverrideEntry,
  OverrideProof,
  ShardData,
  ShardedMerkleTreeInfo,
} from "./types.js";

export async function fetchProofsForClaimer(options: {
  contract: ThirdwebContract;
  claimer: string;
  merkleTreeUri: string;
  tokenDecimals: number;
  hashEntry?: (options: {
    entry: OverrideEntry;
    chain: Chain;
    client: ThirdwebClient;
    tokenDecimals: number;
  }) => Promise<Hex>;
}): Promise<OverrideProof | null> {
  const { contract, merkleTreeUri, claimer } = options;
  const hashEntryFn = options.hashEntry || hashEntry;

  // 2. download snapshot data
  const response = await download({
    client: contract.client,
    uri: merkleTreeUri,
  });
  const merkleInfo: ShardedMerkleTreeInfo = await response.json();

  // 3. download shard data based off the user address
  const shardId = claimer.slice(2, 2 + merkleInfo.shardNybbles).toLowerCase();
  const uri = merkleInfo.baseUri.endsWith("/")
    ? merkleInfo.baseUri
    : `${merkleInfo.baseUri}/`;
  let shardData: ShardData;

  try {
    const constructedShardUri = `${uri}${shardId}.json`;
    const shard = await download({
      client: contract.client,
      uri: constructedShardUri,
    });
    shardData = await shard.json();
  } catch {
    // if the file can't be fetched it means claimer not in merkle tree
    return null;
  }

  // 4. hash all the entries in that shard and construct the sub merkle tree
  const hashedEntries = await Promise.all(
    shardData.entries.map(async (entry) => {
      return hashEntryFn({
        chain: contract.chain,
        client: contract.client,
        entry,
        tokenDecimals: options.tokenDecimals,
      });
    }),
  );
  // 5. get the proof for the claimer + the sub merkle tree root
  const tree = new MerkleTree(hashedEntries);
  const entry = shardData.entries.find(
    (i) => i.address.toLowerCase() === claimer.toLowerCase(),
  );
  if (!entry) {
    return null;
  }
  const proof = tree
    .getHexProof(
      await hashEntryFn({
        chain: contract.chain,
        client: contract.client,
        entry,
        tokenDecimals: options.tokenDecimals,
      }),
    )
    .concat(shardData.proofs);
  // 6. return the proof and the entry data for the contract call
  const currencyAddress = (entry.currencyAddress || ZERO_ADDRESS) as Address;
  const currencyDecimals = await (async () => {
    if (
      isNativeTokenAddress(currencyAddress) ||
      currencyAddress === ZERO_ADDRESS
    ) {
      return 18;
    }
    const [{ getContract }, { decimals: getDecimals }] = await Promise.all([
      import("../../../contract/contract.js"),
      import("../../../extensions/erc20/read/decimals.js"),
    ]);
    const currencyContract = getContract({
      address: currencyAddress,
      chain: contract.chain,
      client: contract.client,
    });
    return await getDecimals({ contract: currencyContract });
  })();

  return {
    currency: currencyAddress,
    pricePerToken: convertQuantity({
      quantity: entry.price || "unlimited",
      tokenDecimals: currencyDecimals,
    }),
    proof,
    quantityLimitPerWallet: convertQuantity({
      quantity: entry.maxClaimable || "unlimited",
      tokenDecimals: options.tokenDecimals,
    }),
  };
}
