import { MerkleTree } from "../src/index";
import { keccak256Sync, sha256Sync } from "@thirdweb-dev/crypto";

describe("MerkleTree", () => {
  it("sha256 with keccak256 leaves", () => {
    const leaves = ["a", "b", "c"].map(keccak256Sync);
    const tree = new MerkleTree(leaves, sha256Sync);

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
    // check equality of the leaves
    expect(tree.getHexLeaves()).toMatchSnapshot();
    // check equality of the layers
    expect(tree.getHexLayers()).toMatchSnapshot();
  });

  it("sha256 with keccak256 leaves with duplicate odd option", () => {
    const leaves = ["a", "b", "c"].map(keccak256Sync);
    const tree = new MerkleTree(leaves, sha256Sync, { duplicateOdd: true });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
    // check equality of the leaves
    expect(tree.getHexLeaves()).toMatchSnapshot();
    // check equality of the layers
    expect(tree.getHexLayers()).toMatchSnapshot();
  });

  it("sha256 with sort pairs option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256Sync);
    const tree = new MerkleTree(leaves, sha256Sync, { sortPairs: true });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
  });

  it("sha256 verify with positional hex proof and no pairSort", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256Sync);
    const tree = new MerkleTree(leaves, sha256Sync, { sortPairs: false });

    expect(
      tree.verify(
        // TODO: accept Uint8Array as input
        tree.getProof(Buffer.from(leaves[1]), 1),
        // TODO: accept Uint8Array as input
        Buffer.from(leaves[1]),
        tree.getHexRoot(),
      ),
    ).toBe(true);
  });

  test("sha256 verify with non-hex proof and no pairSort", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256Sync);
    const tree = new MerkleTree(leaves, sha256Sync, { sortPairs: false });

    expect(
      tree.verify(
        // TODO: accept Uint8Array as input
        tree.getProof(Buffer.from(leaves[1]), 1),
        // TODO: accept Uint8Array as input
        Buffer.from(leaves[1]),
        tree.getHexRoot(),
      ),
    ).toBe(true);
  });

  it("sha256 verify with hex proof and pairSort", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256Sync);
    const tree = new MerkleTree(leaves, sha256Sync, { sortPairs: true });

    expect(
      tree.verify(
        // TODO: accept Uint8Array as input
        tree.getHexProof(Buffer.from(leaves[1]), 1),
        // TODO: accept Uint8Array as input
        Buffer.from(leaves[1]),
        tree.getHexRoot(),
      ),
    ).toBe(true);
  });

  it("keccak256 with sort leaves and sort pairs option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map(
      keccak256Sync,
    );
    const tree = new MerkleTree(leaves, keccak256Sync, {
      sortLeaves: true,
      sortPairs: true,
    });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
  });

  it("keccak256 with sort option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map(
      keccak256Sync,
    );
    const tree = new MerkleTree(leaves, keccak256Sync, { sort: true });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
  });

  it("sha256 with sha256 leaves and sort pairs option and duplicate odd option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256Sync);
    const tree = new MerkleTree(leaves, sha256Sync, {
      sortPairs: true,
      duplicateOdd: true,
    });

    // check equality of the roots
    expect(tree.getHexRoot()).toMatchSnapshot();
  });

  it("sha256 with hash leaves option", () => {
    const expectedRoot =
      "0x1f7379539707bcaea00564168d1d4d626b09b73f8a2a365234c62d763f854da2";

    const leaves = ["a", "b", "c", "d", "e", "f"];
    const tree1 = new MerkleTree(leaves, sha256Sync, { hashLeaves: true });
    expect(tree1.getHexRoot()).toEqual(expectedRoot);

    const hashedLeaves = ["a", "b", "c", "d", "e", "f"].map(sha256Sync);
    const tree2 = new MerkleTree(hashedLeaves, sha256Sync);
    expect(tree2.getHexRoot()).toEqual(expectedRoot);
  });

  it("sha256 with hash leaves option and duplicate odd option", () => {
    const leaves = ["a", "b", "c", "d", "e", "f"];
    const tree = new MerkleTree(leaves, sha256Sync, {
      hashLeaves: true,
      duplicateOdd: true,
    });
    const root =
      "44205acec5156114821f1f71d87c72e0de395633cd1589def6d4444cc79f8103";

    expect(tree.getRoot().toString("hex")).toEqual(root);
  });

  it("solidity keccak256", () => {
    const leaves = ["a", "b", "c"].map(keccak256Sync);

    const a_hash =
      "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb";
    const b_hash =
      "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510";
    const c_hash =
      "0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2";

    expect(leaves.map((l) => Buffer.from(l).toString("hex"))).toEqual([
      a_hash,
      b_hash,
      c_hash,
    ]);

    const tree = new MerkleTree(leaves, keccak256Sync);

    const layers = tree.getLayers().slice(1); // no leaves

    const layer_1 = Buffer.from(
      keccak256Sync(Buffer.concat([leaves[0], leaves[1]])),
    ).toString("hex");

    expect(layers[0][0].toString("hex")).toEqual(layer_1);
    expect(layers[0][1].toString("hex")).toEqual(c_hash);

    const root = Buffer.from(
      "aff1208e69c9e8be9b584b07ebac4e48a1ee9d15ce3afe20b77a4d29e4175aa3",
      "hex",
    );
    expect(tree.getRoot().toString("hex")).toEqual(root.toString("hex"));

    const proof_0 = tree.getProof(Buffer.from(leaves[0]));
    expect(proof_0.length).toEqual(2);
    expect(proof_0[0].position).toEqual("right");
    expect(proof_0[0].data.toString("hex")).toEqual(b_hash);
    expect(proof_0[1].position).toEqual("right");
    expect(proof_0[1].data.toString("hex")).toEqual(c_hash);

    expect(tree.verify(proof_0, Buffer.from(leaves[0]), root)).toBe(true);

    const proof_1 = tree.getProof(Buffer.from(leaves[1]));
    expect(proof_1.length).toEqual(2);
    expect(proof_1[0].position).toEqual("left");
    expect(proof_1[0].data.toString("hex")).toEqual(a_hash);
    expect(proof_1[1].position).toEqual("right");
    expect(proof_1[1].data.toString("hex")).toEqual(c_hash);

    expect(tree.verify(proof_1, Buffer.from(leaves[1]), root)).toBe(true);

    const proof_2 = tree.getProof(Buffer.from(leaves[2]));
    expect(proof_2.length).toEqual(1);
    expect(proof_2[0].position).toEqual("left");
    expect(proof_2[0].data.toString("hex")).toEqual(layer_1);

    expect(tree.verify(proof_2, Buffer.from(leaves[2]), root)).toBe(true);
  });
});
