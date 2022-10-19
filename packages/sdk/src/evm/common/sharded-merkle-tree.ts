import {
  ShardData,
  ShardedMerkleTreeInfo,
  ShardedSnapshot,
  SnapshotEntry,
  SnapshotEntryWithProof,
  SnapshotInputSchema,
} from "../schema";
import { SnapshotInput } from "../types";
import { hashLeafNode } from "./snapshots";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";

// shard using the first 2 hex character of the address
// this splits the merkle tree into 256 shards
// shard files will be 00.json, 01.json, 02.json, ..., ff.json
const SHARD_NYBBLES = 2;

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

  static hashEntry(entry: SnapshotEntry, tokenDecimals: number): string {
    return hashLeafNode(
      entry.address,
      utils.parseUnits(entry.maxClaimable, tokenDecimals),
    );
  }

  static async buildAndUpload(
    snapshotInput: SnapshotInput,
    tokenDecimals: number,
    storage: ThirdwebStorage,
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
            ShardedMerkleTree.hashEntry(entry, tokenDecimals),
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
            ShardedMerkleTree.hashEntry(entry, this.tokenDecimals),
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
    const leaf = ShardedMerkleTree.hashEntry(entry, this.tokenDecimals);
    const proof = this.trees[shardId]
      .getProof(leaf)
      .map((i) => "0x" + i.data.toString("hex"));
    return {
      address,
      proof: proof.concat(shard.proofs),
      maxClaimable: entry.maxClaimable,
    };
  }

  public async getAllEntries(): Promise<SnapshotEntry[]> {
    const entries = await this.storage.downloadJSON<SnapshotEntry[]>(
      this.originalEntriesUri,
    );
    return entries;
  }

  private computeAllShardIds(shardNybbles: number) {
    const max = parseInt(`0x${"f".repeat(shardNybbles)}`, 16);
    const allShards = [];
    for (let i = 0; i <= max; i++) {
      allShards.push(i.toString(16).padStart(shardNybbles, "0"));
    }
    return allShards;
  }
}
