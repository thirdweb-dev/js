import {
  ShardData,
  ShardedMerkleTreeInfo,
  ShardedSnapshot,
  SnapshotEntry,
  SnapshotEntryWithProof,
  SnapshotEntryWithProofSchema,
} from "../schema/contracts/common/snapshots";
import type { SnapshotInput } from "../types/claim-conditions/claim-conditions";
import { convertQuantityToBigNumber } from "./claim-conditions/convertQuantityToBigNumber";
import { fetchCurrencyMetadata } from "./currency/fetchCurrencyMetadata";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { constants, utils, type providers } from "ethers";
import { MerkleTree } from "merkletreejs";
import { parseSnapshotInputs } from "./parseSnapshotInputs";

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
    currencyDecimals: number,
    snapshotFormatVersion: SnapshotFormatVersion,
  ): string {
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
            convertQuantityToBigNumber(
              entry.price || "unlimited",
              currencyDecimals,
            ),
            entry.currencyAddress || constants.AddressZero,
          ],
        );
    }
  }

  static async fetchAndCacheDecimals(
    cache: Record<string, number>,
    provider: providers.Provider,
    currencyAddress?: string,
  ): Promise<number> {
    if (!currencyAddress) {
      return 18;
    }
    // cache decimals for each currency to avoid refetching for every address
    let currencyDecimals = cache[currencyAddress];
    if (currencyDecimals === undefined) {
      const currencyMetadata = await fetchCurrencyMetadata(
        provider,
        currencyAddress,
      );
      currencyDecimals = currencyMetadata.decimals;
      cache[currencyAddress] = currencyDecimals;
    }
    return currencyDecimals;
  }

  static async buildAndUpload(
    snapshotInput: SnapshotInput,
    tokenDecimals: number,
    provider: providers.Provider,
    storage: ThirdwebStorage,
    snapshotFormatVersion: SnapshotFormatVersion,
    shardNybbles = SHARD_NYBBLES,
  ): Promise<ShardedSnapshot> {
    const inputs = await parseSnapshotInputs(snapshotInput);

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
    const currencyDecimalMap: Record<string, number> = {};
    // create shard => subtree root map
    const subTrees = await Promise.all(
      Object.entries(shards).map(async ([shard, entries]) => [
        shard,
        new MerkleTree(
          (
            await Promise.all(
              entries.map((entry) =>
                ShardedMerkleTree.fetchAndCacheDecimals(
                  currencyDecimalMap,
                  provider,
                  entry.currencyAddress,
                ),
              ),
            )
          ).map((currencyDecimals, index) =>
            ShardedMerkleTree.hashEntry(
              entries[index],
              tokenDecimals,
              currencyDecimals,
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
    const roots = Object.fromEntries(subTrees);
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
    provider: providers.Provider,
    snapshotFormatVersion: SnapshotFormatVersion,
  ): Promise<SnapshotEntryWithProof | null> {
    const shardId = address.slice(2, 2 + this.shardNybbles).toLowerCase();
    let shard = this.shards[shardId];
    const currencyDecimalMap: Record<string, number> = {};
    if (shard === undefined) {
      try {
        shard = this.shards[shardId] =
          await this.storage.downloadJSON<ShardData>(
            `${this.baseUri}/${shardId}.json`,
          );
        const hashedEntries = (
          await Promise.all(
            shard.entries.map((entry) =>
              ShardedMerkleTree.fetchAndCacheDecimals(
                currencyDecimalMap,
                provider,
                entry.currencyAddress,
              ),
            ),
          )
        ).map((currencyDecimals, index) => {
          const entry = shard.entries[index];
          return ShardedMerkleTree.hashEntry(
            entry,
            this.tokenDecimals,
            currencyDecimals,
            snapshotFormatVersion,
          );
        });
        this.trees[shardId] = new MerkleTree(hashedEntries, utils.keccak256, {
          sort: true,
        });
      } catch (e) {
        return null;
      }
    }
    const entry = shard.entries.find(
      (i) => i.address.toLowerCase() === address.toLowerCase(),
    );
    if (!entry) {
      return null;
    }
    const currencyDecimals = await ShardedMerkleTree.fetchAndCacheDecimals(
      currencyDecimalMap,
      provider,
      entry.currencyAddress,
    );
    const leaf = ShardedMerkleTree.hashEntry(
      entry,
      this.tokenDecimals,
      currencyDecimals,
      snapshotFormatVersion,
    );
    const proof = this.trees[shardId]
      .getProof(leaf)
      .map((i) => "0x" + i.data.toString("hex"));
    return SnapshotEntryWithProofSchema.parseAsync({
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
