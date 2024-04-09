import { concat } from "viem";
import { describe, expect, it as test } from "vitest";
import { keccakId } from "../utils/any-evm/keccak-id.js";
import { hexToUint8Array, uint8ArrayToHex } from "../utils/encoding/hex.js";
import { stringToBytes } from "../utils/encoding/to-bytes.js";
import { keccak256 } from "../utils/hashing/keccak256.js";
import { sha256 } from "../utils/hashing/sha256.js";
import { concatUint8Arrays } from "../utils/uint8-array.js";
import { MerkleTree } from "./MerkleTree.js";

describe("MerkleTree", () => {
  test("sha256 with keccak256 leaves", () => {
    const leaves = ["a", "b", "c"].map(keccakId);
    const tree = new MerkleTree(leaves, sha256);

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
    // check equality of the leaves
    expect(tree.getHexLeaves()).toMatchSnapshot();
    // check equality of the layers
    expect(tree.getHexLayers()).toMatchSnapshot();
  });

  test("sha256 with keccak256 leaves with duplicate odd option", () => {
    const leaves = ["a", "b", "c"].map(keccakId);
    const tree = new MerkleTree(leaves, sha256, { duplicateOdd: true });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
    // check equality of the leaves
    expect(tree.getHexLeaves()).toMatchSnapshot();
    // check equality of the layers
    expect(tree.getHexLayers()).toMatchSnapshot();
  });

  test("sha256 with sort pairs option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map((v) =>
      sha256(stringToBytes(v)),
    );
    const tree = new MerkleTree(leaves, sha256, { sortPairs: true });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
  });

  test("sha256 verify with positional hex proof and no pairSort", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map((v) =>
      sha256(stringToBytes(v)),
    );
    const tree = new MerkleTree(leaves, sha256, { sortPairs: false });

    expect(
      tree.verify(
        // biome-ignore lint/style/noNonNullAssertion: test
        tree.getProof(leaves[1]!, 1),
        // biome-ignore lint/style/noNonNullAssertion: test
        leaves[1]!,
        tree.getHexRoot(),
      ),
    ).toBe(true);
  });

  test("sha256 verify with non-hex proof and no pairSort", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map((v) =>
      sha256(stringToBytes(v)),
    );
    const tree = new MerkleTree(leaves, sha256, { sortPairs: false });

    expect(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      tree.verify(tree.getProof(leaves[1]!, 1), leaves[1]!, tree.getHexRoot()),
    ).toBe(true);
  });

  test("sha256 verify with hex proof and pairSort", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map((v) =>
      sha256(stringToBytes(v)),
    );
    const tree = new MerkleTree(leaves, sha256, { sortPairs: true });

    expect(
      tree.verify(
        // TODO: accept Uint8Array as input
        tree.getHexProof(leaves[1]!, 1),
        // TODO: accept Uint8Array as input
        leaves[1]!,
        tree.getHexRoot(),
      ),
    ).toBe(true);
  });

  test("keccak256 with sort leaves and sort pairs option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map(
      keccakId,
    );
    const tree = new MerkleTree(leaves, keccakId, {
      sortLeaves: true,
      sortPairs: true,
    });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
  });

  test("keccak256 with sort option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map(
      keccakId,
    );
    const tree = new MerkleTree(leaves, keccakId, { sort: true });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
  });

  test("sha256 with sha256 leaves and sort pairs option and duplicate odd option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map((v) =>
      sha256(stringToBytes(v)),
    );
    const tree = new MerkleTree(leaves, sha256, {
      sortPairs: true,
      duplicateOdd: true,
    });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
  });

  test("sha256 with hash leaves option", () => {
    const expectedRoot =
      "0x1f7379539707bcaea00564168d1d4d626b09b73f8a2a365234c62d763f854da2";

    const leaves = ["a", "b", "c", "d", "e", "f"];
    const tree1 = new MerkleTree(leaves, sha256, { hashLeaves: true });
    expect(tree1.getHexRoot()).toEqual(expectedRoot);

    const hashedLeaves = ["a", "b", "c", "d", "e", "f"].map((v) =>
      sha256(stringToBytes(v)),
    );
    const tree2 = new MerkleTree(hashedLeaves, sha256);
    expect(tree2.getHexRoot()).toEqual(expectedRoot);
  });

  test("sha256 with hash leaves option and duplicate odd option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"];
    const tree = new MerkleTree(leaves, sha256, {
      hashLeaves: true,
      duplicateOdd: true,
    });
    const root =
      "0x44205acec5156114821f1f71d87c72e0de395633cd1589def6d4444cc79f8103";

    expect(tree.getHexRoot()).toEqual(root);
  });

  test("solidity keccak256", () => {
    const leaves = ["a", "b", "c"].map(keccakId);

    const a_hash =
      "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb";
    const b_hash =
      "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510";
    const c_hash =
      "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2";

    expect(leaves).toEqual([a_hash, b_hash, c_hash]);

    const tree = new MerkleTree(leaves, keccakId);

    const layers = tree.getHexLayers().slice(1); // no leaves

    const layer_1 = "0xa823e1adfad5920f542db402eb9598f9c0464220fe0293df1a007424061cd1df"

    expect(layers[0]![0]!).toEqual(layer_1);
    expect(layers[0]![1]!).toEqual(c_hash);

    const root = "0x3c0f3e5eaffaf5aa01e231c75b30139492d251862c4716b24d2bbb39deea4f6e";
    expect(tree.getHexRoot()).toEqual(root);

    const proof_0 = tree.getProof(leaves[0]!);
    expect(proof_0.length).toEqual(2);
    expect(proof_0[0]!.position).toEqual("right");
    expect(uint8ArrayToHex(proof_0[0]!.data)).toEqual(b_hash);
    expect(proof_0[1]!.position).toEqual("right");
    expect(uint8ArrayToHex(proof_0[1]!.data)).toEqual(c_hash);

    expect(tree.verify(proof_0, leaves[0]!, root)).toBe(true);

    const proof_1 = tree.getProof(leaves[1]!);
    expect(proof_1.length).toEqual(2);
    expect(proof_1[0]!.position).toEqual("left");
    expect(uint8ArrayToHex(proof_1[0]!.data)).toEqual(a_hash);
    expect(proof_1[1]!.position).toEqual("right");
    expect(uint8ArrayToHex(proof_1[1]!.data)).toEqual(c_hash);

    expect(tree.verify(proof_1, leaves[1]!, root)).toBe(true);

    const proof_2 = tree.getProof(leaves[2]!);
    expect(proof_2.length).toEqual(1);
    expect(proof_2[0]!.position).toEqual("left");
    expect(uint8ArrayToHex(proof_2[0]!.data)).toEqual(layer_1);

    expect(tree.verify(proof_2, leaves[2]!, root)).toBe(true);
  });
});
