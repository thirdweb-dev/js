import { describe, expect, it } from "vitest";
import { MerkleTree } from "./MerkleTree.js";

// compare to previous version of the merkletree logic
// TODO: remove this in the future
import { MerkleTree as OldMerkleTree } from "../../../../legacy_packages/merkletree/src/merkletree/MerkleTree.js";
import { keccak256 } from "../utils/hashing/keccak256.js";

describe("MerkleTree", () => {
  describe("getHexRoot", () => {
    it("should return the hex representation of the root hash", () => {
      const leaves = ["leaf1", "leaf2", "leaf3"].map((el) => Buffer.from(el));
      const merkleTree = new MerkleTree(leaves);
      const old = new OldMerkleTree(leaves, keccak256, { sort: true });

      const hexRoot = merkleTree.getHexRoot();
      const oldHexRoot = old.getHexRoot();

      expect(hexRoot).toMatchInlineSnapshot(
        `"0xebd2ffa91ce49e68a5ae1283e5babdf2655f8ea9ea0ee36ed525cc41d171a882"`,
      );
      expect(hexRoot).toMatchInlineSnapshot(
        `"0xebd2ffa91ce49e68a5ae1283e5babdf2655f8ea9ea0ee36ed525cc41d171a882"`,
      );
      expect(hexRoot).toBe(oldHexRoot);
    });
  });

  describe("getHexProof", () => {
    it("should return the hex representation of the proof for a leaf", () => {
      const leaves = ["leaf1", "leaf2", "leaf3"].map((el) => Buffer.from(el));
      const merkleTree = new MerkleTree(leaves);

      // biome-ignore lint/style/noNonNullAssertion: tests
      const hexProof = merkleTree.getHexProof(leaves[0]!);

      expect(hexProof).toMatchInlineSnapshot(`
        [
          "0x6c65616632",
          "0x6c65616633",
        ]
      `);

      // compare to previous version of the merkletree libray
      const old = new OldMerkleTree(leaves, keccak256, { sort: true });
      // biome-ignore lint/style/noNonNullAssertion: tests
      const oldHexProof = old.getHexProof(leaves[0]!);
      expect(hexProof).toStrictEqual(oldHexProof);
      expect(oldHexProof).toMatchInlineSnapshot(`
        [
          "0x6c65616632",
          "0x6c65616633",
        ]
      `);
    });

    it("should return the hex representation of the proof for a leaf at a specific index", () => {
      const leaves = ["leaf1", "leaf2", "leaf3"].map((el) => Buffer.from(el));
      const merkleTree = new MerkleTree(leaves);

      // biome-ignore lint/style/noNonNullAssertion: tests
      const hexProof = merkleTree.getHexProof(leaves[1]!, 1);

      expect(hexProof).toMatchInlineSnapshot(`
        [
          "0x6c65616631",
          "0x6c65616633",
        ]
      `);

      // compare to previous version of the merkletree libray
      const old = new OldMerkleTree(leaves, keccak256, { sort: true });
      // biome-ignore lint/style/noNonNullAssertion: tests
      const oldHexProof = old.getHexProof(leaves[1]!, 1);
      expect(hexProof).toStrictEqual(oldHexProof);
      expect(oldHexProof).toMatchInlineSnapshot(`
        [
          "0x6c65616631",
          "0x6c65616633",
        ]
      `);
    });
  });
});
