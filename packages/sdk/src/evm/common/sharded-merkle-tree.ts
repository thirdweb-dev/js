import {
  ShardData,
  ShardedMerkleTreeInfo,
  ShardedSnapshot,
  SnapshotEntriesOutput,
  SnapshotEntry,
  SnapshotEntryOutput,
  SnapshotInputSchema,
} from "../schema";
import { SnapshotInput } from "../types";
import { hashLeafNode } from "./snapshots";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers, utils } from "ethers";
import { MerkleTree } from "merkletreejs";

export class ShardedMerkleTree {
  private shardNybbles: number;
  private shards: Record<string, ShardData>;
  private trees: Record<string, MerkleTree>;
  private storage: ThirdwebStorage;
  private baseUri: string;
  private tokenDecimals: number;

  constructor(
    storage: ThirdwebStorage,
    baseUri: string,
    shardNybbles: number,
    tokenDecimals: number,
  ) {
    this.storage = storage;
    this.shardNybbles = shardNybbles;
    this.baseUri = baseUri;
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
      info.shardNybbles,
      info.tokenDecimals,
    );
  }

  static async buildAndUpload(
    snapshotInput: SnapshotInput,
    shardNybbles: number,
    tokenDecimals: number,
    storage: ThirdwebStorage,
  ): Promise<ShardedSnapshot> {
    const inputs = SnapshotInputSchema.parse(snapshotInput);
    // TODO derive shardNybbles from input size
    const shards: Record<string, SnapshotEntry[]> = {};
    // let total = ethers.BigNumber.from(0);
    for (const snapshotEntry of inputs) {
      const shard = snapshotEntry.address
        .slice(2, 2 + shardNybbles)
        .toLowerCase();
      if (shards[shard] === undefined) {
        shards[shard] = [];
      }
      shards[shard].push(snapshotEntry);
      // total = total.add(entry.balance);
    }
    // create shard => subtree root map
    const roots = Object.fromEntries(
      Object.entries(shards).map(([shard, entries]) => [
        shard,
        new MerkleTree(
          entries.map((i) =>
            hashLeafNode(
              i.address,
              utils.parseUnits(i.maxClaimable, tokenDecimals),
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

    const shardedMerkleInfo: ShardedMerkleTreeInfo = {
      merkleRoot: tree.getHexRoot(),
      baseUri,
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

  public async getProof(address: string): Promise<SnapshotEntryOutput | null> {
    const shardId = address.slice(2, 2 + this.shardNybbles).toLowerCase();
    let shard = this.shards[shardId];
    if (shard === undefined) {
      try {
        shard = this.shards[shardId] =
          await this.storage.downloadJSON<ShardData>(
            `${this.baseUri}/${shardId}.json`,
          );
        this.trees[shardId] = new MerkleTree(
          Object.entries(shard.entries).map(([, entry]) =>
            hashLeafNode(entry.address, entry.maxClaimable),
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
    const leaf = hashLeafNode(entry.address, entry.maxClaimable);
    const proof = this.trees[shardId]
      .getProof(leaf)
      .map((i) => "0x" + i.data.toString("hex"));
    return {
      address,
      proof: proof.concat(shard.proofs),
      maxClaimable: ethers.utils
        .parseUnits(entry.maxClaimable, this.tokenDecimals)
        .toString(),
    };
  }

  public async getAllEntries(): Promise<SnapshotEntriesOutput> {
    const allShards = this.computeAllShardIds(this.shardNybbles);
    const shardsUris = allShards.map(
      (shardId) => `${this.baseUri}/${shardId}.json`,
    );
    const shards = await Promise.all(
      shardsUris.map((uri) =>
        this.storage.downloadJSON<ShardData>(uri).catch(() => undefined),
      ),
    );
    return shards
      .flatMap((shard) => (shard ? shard.entries : []))
      .map((entry) => ({
        proof: [] as string[],
        ...entry,
      }));
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
