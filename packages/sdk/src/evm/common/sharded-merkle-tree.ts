import {
  ShardData,
  ShardedMerkleTreeInfo,
  ShardedSnapshot,
  SnapshotEntry,
  SnapshotEntryWithProof,
  SnapshotEntryWithProofSchema,
  SnapshotInputSchema,
} from "../schema";
import { SnapshotInput } from "../types";
import { convertQuantityToBigNumber } from "./claim-conditions";
import { hashLeafNode } from "./snapshots";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";

// shard using the first 2 hex character of the address
// this splits the merkle tree into 256 shards
// shard files will be 00.json, 01.json, 02.json, ..., ff.json
const SHARD_NYBBLES = 2;

export enum SnapshotFormatVersion {
  V1 = 1, // address and maxClaimable
  V2 = 2, // address, maxClaimable, price, currencyAddress
}

export class ShardedMerkleTree {
  private shardNybbles: number;
  private shards: Record<string, ShardData>;
  private trees: Record<string, MerkleTree>;
  private storage: ThirdwebStorage;
  private baseUri: string;
  private originalEntriesUri: string;
  private tokenDecimals: number;

  constructor(
    storage: ThirdwebStorage,
    baseUri: string,
    originalEntriesUri: string,
    shardNybbles: number,
    tokenDecimals: number,
  ) {
    this.storage = storage;
    this.shardNybbles = shardNybbles;
    this.baseUri = baseUri;
    this.originalEntriesUri = originalEntriesUri;
    this.tokenDecimals = tokenDecimals;
    this.shards = {};
    this.trees = {};
  }

  static async fromUri(
    uri: string,
    storage: ThirdwebStorage,
  ): Promise<ShardedMerkleTree | undefined> {
    try {
      const shardedMerkleTreeInfo =
        await storage.downloadJSON<ShardedMerkleTreeInfo>(uri);
      if (shardedMerkleTreeInfo.isShardedMerkleTree) {
        return ShardedMerkleTree.fromShardedMerkleTreeInfo(
          shardedMerkleTreeInfo,
          storage,
        );
      }
    } catch (e) {
      return undefined;
    }
  }

  static async fromShardedMerkleTreeInfo(
    info: ShardedMerkleTreeInfo,
    storage: ThirdwebStorage,
  ): Promise<ShardedMerkleTree> {
    return new ShardedMerkleTree(
      storage,
      info.baseUri,
      info.originalEntriesUri,
      info.shardNybbles,
      info.tokenDecimals,
    );
  }

  static hashEntry(
    entry: SnapshotEntry,
    tokenDecimals: number,
    snapshotFormatVersion: SnapshotFormatVersion,
  ): string {
    // TODO (cc) hash price and currency
    // TODO (cc) differentiate between default values for maxClaimable

    // TODO (cc) for legacy contracts, need to only hash addr / maxclaimable!!
    switch (snapshotFormatVersion) {
      case SnapshotFormatVersion.V1:
        return utils.solidityKeccak256(
          ["address", "uint256"],
          [
            entry.address,
            convertQuantityToBigNumber(entry.maxClaimable, tokenDecimals),
          ],
        );
      case SnapshotFormatVersion.V2:
        return utils.solidityKeccak256(
          ["address", "uint256", "uint256", "address"],
          [
            entry.address,
            convertQuantityToBigNumber(entry.maxClaimable, tokenDecimals),
            convertQuantityToBigNumber(entry.price, 18), // TODO (cc) use currencyDecimals
            entry.currencyAddress,
          ],
        );
    }
  }

  static async buildAndUpload(
    snapshotInput: SnapshotInput,
    tokenDecimals: number,
    storage: ThirdwebStorage,
    snapshotFormatVersion: SnapshotFormatVersion,
    shardNybbles = SHARD_NYBBLES,
  ): Promise<ShardedSnapshot> {
    const inputs = SnapshotInputSchema.parse(snapshotInput);
    // TODO Could also derive shardNybbles from input size
    const shards: Record<string, SnapshotEntry[]> = {};
    for (const snapshotEntry of inputs) {
      const shard = snapshotEntry.address
        .slice(2, 2 + shardNybbles)
        .toLowerCase();
      if (shards[shard] === undefined) {
        shards[shard] = [];
      }
      shards[shard].push(snapshotEntry);
    }
    // create shard => subtree root map
    const roots = Object.fromEntries(
      Object.entries(shards).map(([shard, entries]) => [
        shard,
        new MerkleTree(
          entries.map((entry) =>
            ShardedMerkleTree.hashEntry(
              entry,
              tokenDecimals,
              snapshotFormatVersion,
            ),
          ),
          utils.keccak256,
          {
            sort: true,
          },
        ).getHexRoot(),
      ]),
    );
    // create master tree from shard => subtree root map
    const tree = new MerkleTree(Object.values(roots), utils.keccak256, {
      sort: true,
    });

    const shardsToUpload = [];
    for (const [shardId, entries] of Object.entries(shards)) {
      const data: ShardData = {
        proofs: tree
          .getProof(roots[shardId])
          .map((value) => "0x" + value.data.toString("hex")),
        entries,
      };
      shardsToUpload.push({
        data: JSON.stringify(data),
        name: `${shardId}.json`,
      });
    }
    const uris = await storage.uploadBatch(shardsToUpload);
    const baseUri = uris[0].slice(0, uris[0].lastIndexOf("/"));

    const originalEntriesUri = await storage.upload(inputs);

    const shardedMerkleInfo: ShardedMerkleTreeInfo = {
      merkleRoot: tree.getHexRoot(),
      baseUri,
      originalEntriesUri,
      shardNybbles,
      tokenDecimals,
      isShardedMerkleTree: true,
    };

    const masterUri = await storage.upload(shardedMerkleInfo);

    return {
      shardedMerkleInfo,
      uri: masterUri,
    };
  }

  public async getProof(
    address: string,
    snapshotFormatVersion: SnapshotFormatVersion,
  ): Promise<SnapshotEntryWithProof | null> {
    const shardId = address.slice(2, 2 + this.shardNybbles).toLowerCase();
    let shard = this.shards[shardId];
    if (shard === undefined) {
      try {
        shard = this.shards[shardId] =
          await this.storage.downloadJSON<ShardData>(
            `${this.baseUri}/${shardId}.json`,
          );
        this.trees[shardId] = new MerkleTree(
          shard.entries.map((entry) =>
            ShardedMerkleTree.hashEntry(
              entry,
              this.tokenDecimals,
              snapshotFormatVersion,
            ),
          ),
          utils.keccak256,
          { sort: true },
        );
      } catch (e) {
        console.warn("No merkle entry found for address", address);
        return null;
      }
    }
    const entry = shard.entries.find(
      (i) => i.address.toLowerCase() === address.toLowerCase(),
    );
    if (!entry) {
      return null;
    }
    const leaf = ShardedMerkleTree.hashEntry(
      entry,
      this.tokenDecimals,
      snapshotFormatVersion,
    );
    const proof = this.trees[shardId]
      .getProof(leaf)
      .map((i) => "0x" + i.data.toString("hex"));
    return SnapshotEntryWithProofSchema.parse({
      ...entry,
      proof: proof.concat(shard.proofs),
    });
  }

  public async getAllEntries(): Promise<SnapshotEntry[]> {
    try {
      return await this.storage.downloadJSON<SnapshotEntry[]>(
        this.originalEntriesUri,
      );
    } catch (e) {
      console.warn("Could not fetch original snapshot entries", e);
      return [];
    }
  }
}
