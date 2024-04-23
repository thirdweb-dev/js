// ADAPTED FROM https://github.com/merkletreejs/merkletreejs
import { type Hex, uint8ArrayToHex } from "../utils/encoding/hex.js";
import { hexToBytes } from "../utils/encoding/to-bytes.js";
import { keccak256 } from "../utils/hashing/keccak256.js";
import {
  areUint8ArraysEqual,
  compareUint8Arrays,
  concatUint8Arrays,
} from "../utils/uint8-array.js";

// TODO: clean this up more, there is probably something to be said to move this entirely out of a class

type TLeaf = Uint8Array;
type TLayer = Uint8Array[];

/**
 * Class reprensenting a Merkle Tree
 * @namespace MerkleTree
 */
export class MerkleTree {
  private leaves: TLeaf[] = [];
  private layers: TLayer[] = [];

  constructor(leaves: (Uint8Array | Hex)[]) {
    this.leaves = leaves.map((el) =>
      el instanceof Uint8Array ? el : hexToBytes(el),
    );

    this.leaves = this.leaves.sort();

    this.createHashes(this.leaves);
  }

  public getHexRoot(): `0x${string}` {
    return uint8ArrayToHex(this.getRoot());
  }

  public getHexProof(leaf: Uint8Array | Hex, index?: number): `0x${string}`[] {
    return this.getProof(leaf, index).map((item) => uint8ArrayToHex(item.data));
  }

  // private below

  private createHashes(nodes: Uint8Array[]) {
    this.layers = [nodes];
    while (nodes.length > 1) {
      const layerIndex = this.layers.length;

      this.layers.push([]);

      const layerLimit = nodes.length;

      for (let i = 0; i < nodes.length; i += 2) {
        if (i >= layerLimit) {
          // biome-ignore lint/style/noNonNullAssertion: in bounds
          this.layers[layerIndex]!.push(...nodes.slice(layerLimit));
          break;
        }
        if (i + 1 === nodes.length) {
          if (nodes.length % 2 === 1) {
            // push copy of hash and continue iteration
            // biome-ignore lint/style/noNonNullAssertion: in bounds
            this.layers[layerIndex]!.push(nodes[i]!);
            continue;
          }
        }

        // biome-ignore lint/style/noNonNullAssertion: in bounds
        const left = nodes[i]!;
        // biome-ignore lint/style/noNonNullAssertion: in bounds
        const right = i + 1 === nodes.length ? left : nodes[i + 1]!;
        const combined = [left, right];

        combined.sort(compareUint8Arrays);

        const hash = keccak256(concatUint8Arrays(combined), "bytes");

        // biome-ignore lint/style/noNonNullAssertion: in bounds
        this.layers[layerIndex]!.push(hash);
      }
      // biome-ignore lint/style/noParameterAssign: part of the functionality
      // biome-ignore lint/style/noNonNullAssertion: in bounds
      nodes = this.layers[layerIndex]!;
    }
  }

  private getRoot(): Uint8Array {
    if (this.layers.length === 0) {
      return new Uint8Array();
    }

    // biome-ignore lint/style/noNonNullAssertion: in bounds
    return this.layers[this.layers.length - 1]![0] || new Uint8Array();
  }

  private getProof(
    leaf: Uint8Array | Hex,
    index?: number,
  ): { position: "left" | "right"; data: Uint8Array }[] {
    if (typeof leaf === "undefined") {
      throw new Error("leaf is required");
    }
    // biome-ignore lint/style/noParameterAssign: part of the functionality
    leaf = leaf instanceof Uint8Array ? leaf : hexToBytes(leaf);
    const proof = [];

    if (!Number.isInteger(index)) {
      // biome-ignore lint/style/noParameterAssign: part of the functionality
      index = -1;

      for (let i = 0; i < this.leaves.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: within bounds
        if (areUint8ArraysEqual(leaf, this.leaves[i]!)) {
          // biome-ignore lint/style/noParameterAssign: part of the functionality
          index = i;
        }
      }
    }

    // @ts-expect-error - issue from original code
    if (index <= -1) {
      return [];
    }

    for (let i = 0; i < this.layers.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: in bounds
      const layer = this.layers[i]!;
      // @ts-expect-error - issue from original code
      const isRightNode = index % 2;
      const pairIndex = isRightNode
        ? // @ts-expect-error - issue from original code
          index - 1
        : // Proof Generation for Non-Bitcoin Trees
          // @ts-expect-error - issue from original code
          index + 1;

      if (pairIndex < layer.length) {
        proof.push({
          position: isRightNode ? "left" : "right",
          data: layer[pairIndex],
        });
      }

      // set index to parent index
      // @ts-expect-error - issue from original code
      // biome-ignore lint/style/noParameterAssign: part of the functionality
      index = (index / 2) | 0;
    }

    // @ts-expect-error - issue from original code
    return proof;
  }
}
