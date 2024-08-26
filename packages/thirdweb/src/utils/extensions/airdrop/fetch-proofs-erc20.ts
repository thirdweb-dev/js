import type { ThirdwebContract } from "../../../contract/contract.js";
import { getContractMetadata } from "../../../extensions/common/read/getContractMetadata.js";
import { MerkleTree } from "../../../merkletree/MerkleTree.js";
import { download } from "../../../storage/download.js";
import type { Address } from "../../address.js";
import { convertQuantity } from "../drops/convert-quantity.js";
import { hashEntryERC20 } from "./hash-entry-erc20.js";
import type {
  ClaimProofERC20,
  ShardDataERC20,
  ShardedMerkleTreeInfo,
} from "./types.js";

/**
 * Retrieves the claim merkle proof for the provided address.
 * @param {Object} options
 * @param {@link ThirdwebContract} contract - The ERC20 airdrop contract
 * @param {string} recipient - The address of the drop recipient
 * @param {string} merkleRoot - The merkle root, found on the active claim condition
 *
 * @returns {Promise<ClaimProofERC20 | null>} A promise that resolves to the proof or null if the recipient is not in the allowlist
 *
 * @example
 * ```ts
 * import { fetchProofsERCC20 } from "thirdweb/extensions/airdrop";
 * import { getContract, defineChain } from "thirdweb";
 *
 * const TOKEN = getContracct({
 *  client,
 *  chain: defineChain(1),
 *  address: "0x..."
 * });
 *
 * const merkleRoot = await tokenMerkleRoot({
 *  contract: TOKEN,
 *  tokenAddress: TOKEN.address
 * });
 *
 * const proof = await fetchProofsERC20({
 *  contract: TOKEN,
 *  recipient: "0x...",
 *  merkleRoot
 * });
 * ```
 *
 * @extension AIRDROP
 */
export async function fetchProofsERC20(options: {
  contract: ThirdwebContract;
  recipient: string;
  merkleRoot: string;
  tokenDecimals: number;
}): Promise<ClaimProofERC20 | null> {
  const { contract, merkleRoot, recipient } = options;
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
  const shardId = recipient.slice(2, 2 + merkleInfo.shardNybbles).toLowerCase();
  const uri = merkleInfo.baseUri.endsWith("/")
    ? merkleInfo.baseUri
    : `${merkleInfo.baseUri}/`;
  let shardData: ShardDataERC20;

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
      return hashEntryERC20({
        entry,
        tokenDecimals: options.tokenDecimals,
      });
    }),
  );
  const tree = new MerkleTree(hashedEntries);
  // 5. get the proof for the claimer + the sub merkle tree root
  const entry = shardData.entries.find(
    (i) => i.recipient.toLowerCase() === recipient.toLowerCase(),
  );
  if (!entry) {
    return null;
  }
  const proof = tree
    .getHexProof(
      await hashEntryERC20({
        entry,
        tokenDecimals: options.tokenDecimals,
      }),
    )
    .concat(shardData.proofs);

  const quantity = convertQuantity({
    quantity: entry.amount.toString(),
    tokenDecimals: options.tokenDecimals,
  });

  return {
    proof,
    recipient: recipient as Address,
    quantity,
  };
}
