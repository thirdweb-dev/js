import { describe, expect, it } from "vitest";
import type { Hex } from "../utils/encoding/hex.js";
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

    it("should return root for large merkle trees", () => {
      const leaves: Hex[] = [
        "0xe1b12834247548c6bf6a9d37d2090a5f41beda62be633f705bc7c6e924342b4d",
        "0x232570d6677f4e4b8947d8369750a4da492511d19e104db19dfae1200c3ff4db",
        "0xe30d909533984527552083c16f23927cb9928c2e01b7252989f1c4fb9714deca",
        "0xd13d5d1bf095147532482f25aac6d72905850864aab58f9dac28beb655dc4726",
        "0xa0eea66d581045e22cbeccd59027e62b5d753fd3118f068b444bceec601be03f",
        "0x222cd80957bf16ed8ce63a492a5035830cc2bfe04e2d46cc28e3aacb5db1277a",
        "0xb1525c3a1a9d0fa632857acd0216609a80c19293fc3273f4cac664ca49a9e323",
        "0x18b19c2a11bd54e98cc841bc8863d3e8582da3dd21903aedfe6745d41083653b",
        "0xc198129437401b73388fa41dfaa82457015716050c6632364a1db94db1f0fb19",
        "0x7621bd1c73bb5d8487459d8be36c5445a65a7fda457972d7f9de22a826739281",
        "0x1cc9ca923d763f8de998921de43da79d6415eaff9b875e3e619c246fc26160b7",
        "0xb4526c4f954e3230701cb7a392081007c050e950d886a25bac5fb14e3639e258",
        "0x7d00f9a67344ed46afab13a398ea4bbf40915283f08f5caaf7d128a836361943",
        "0xb11d4116f885aa50e9e9cbddf61b4d582413cd959302c68bfc0430fe8d5f609b",
        "0xd474bee9ba879f0e0ae0827601642460e5439b4c3acb69da07b77ae2779a4eb2",
        "0xb2b902dfab66d5dbee090467f02abd14c49e11f92a7d58fda53982f006f4360c",
        "0x7ed8ec6456a2418c91d362f5ef5b4865d68a1df05722fe0fa9ecf23e0fc7e935",
        "0xb1efbe628e4a0062c6f241f2ccd3663269fafb4305d2cbe33c6f94d0aea8e195",
      ];
      const merkleTree = new MerkleTree(leaves);
      const hexProof = merkleTree.getHexRoot();

      expect(hexProof).toBe(
        "0x58053466a63f980211c457688c927035d61a7717b7744afe3758138ce66a6fda",
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
