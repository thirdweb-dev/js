import {
  ADDRESS_ZERO,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { getContractMetadata } from "../../../extensions/common/read/getContractMetadata.js";
import { MerkleTree } from "../../../merkletree/MerkleTree.js";
import { download } from "../../../storage/download.js";
import type { Address } from "../../address.js";
import { convertQuantity } from "./convert-quantity.js";
import { hashEntry } from "./hash-entry.js";
import type {
  OverrideProof,
  ShardData,
  ShardedMerkleTreeInfo,
} from "./types.js";

export async function fetchProofsForClaimer(options: {
  contract: ThirdwebContract;
  claimer: string;
  merkleRoot: string;
  tokenDecimals: number;
}): Promise<OverrideProof | null> {
  const { contract, merkleRoot, claimer } = options;
  // 1. fetch merkle data from contract URI
  const metadata = await getContractMetadata({
    contract,
  });
  const merkleData: Record<string, string> = metadata.merkle || {};
  const snapshotUri = merkleData[merkleRoot];

  if (!snapshotUri) {
    return null;
  }
  // 2. download snapshot data
  const response = await download({
    client: contract.client,
    uri: snapshotUri,
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
  } catch (e) {
    // if the file can't be fetched it means claimer not in merkle tree
    return null;
  }

  // 4. hash all the entries in that shard and construct the sub merkle tree
  const hashedEntries = await Promise.all(
    shardData.entries.map(async (entry) => {
      return hashEntry({
        entry,
        chain: contract.chain,
        client: contract.client,
        tokenDecimals: options.tokenDecimals,
      });
    }),
  );
  const tree = new MerkleTree(hashedEntries);
  // 5. get the proof for the claimer + the sub merkle tree root
  const entry = shardData.entries.find(
    (i) => i.address.toLowerCase() === claimer.toLowerCase(),
  );
  if (!entry) {
    return null;
  }
  const proof = tree
    .getHexProof(
      await hashEntry({
        entry,
        chain: contract.chain,
        client: contract.client,
        tokenDecimals: options.tokenDecimals,
      }),
    )
    .concat(shardData.proofs);
  // 6. return the proof and the entry data for the contract call
  const currencyAddress = (entry.currencyAddress || ADDRESS_ZERO) as Address;
  const currencyDecimals = await (async () => {
    if (
      isNativeTokenAddress(currencyAddress) ||
      currencyAddress === ADDRESS_ZERO
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
    proof,
    quantityLimitPerWallet: convertQuantity({
      quantity: entry.maxClaimable || "unlimited",
      tokenDecimals: options.tokenDecimals,
    }),
    pricePerToken: convertQuantity({
      quantity: entry.price || "unlimited",
      tokenDecimals: currencyDecimals,
    }),
    currency: currencyAddress,
  };
}
