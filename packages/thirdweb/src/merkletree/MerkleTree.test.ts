import { describe, expect, it } from "vitest";
import { stringToBytes } from "../utils/encoding/to-bytes.js";
import { MerkleTree } from "./MerkleTree.js";

describe("MerkleTree", () => {
  describe("getHexRoot", () => {
    it("should return the hex representation of the root hash", () => {
      const leaves = ["leaf1", "leaf2", "leaf3"].map((el) => stringToBytes(el));
      const merkleTree = new MerkleTree(leaves);

      const hexRoot = merkleTree.getHexRoot();

      expect(hexRoot).toMatchInlineSnapshot(
        `"0xebd2ffa91ce49e68a5ae1283e5babdf2655f8ea9ea0ee36ed525cc41d171a882"`,
      );
    });
  });

  describe("getHexProof", () => {
    it("should return the hex representation of the proof for a leaf", () => {
      const leaves = ["leaf1", "leaf2", "leaf3"].map((el) => stringToBytes(el));
      const merkleTree = new MerkleTree(leaves);

      // biome-ignore lint/style/noNonNullAssertion: tests
      const hexProof = merkleTree.getHexProof(leaves[0]!);

      expect(hexProof).toMatchInlineSnapshot(`
        [
          "0x6c65616632",
          "0x6c65616633",
        ]
      `);
    });

    it("should return the hex representation of the proof for a leaf at a specific index", () => {
      const leaves = ["leaf1", "leaf2", "leaf3"].map((el) => stringToBytes(el));
      const merkleTree = new MerkleTree(leaves);

      // biome-ignore lint/style/noNonNullAssertion: tests
      const hexProof = merkleTree.getHexProof(leaves[1]!, 1);

      expect(hexProof).toMatchInlineSnapshot(`
        [
          "0x6c65616631",
          "0x6c65616633",
        ]
      `);
    });
  });
});
