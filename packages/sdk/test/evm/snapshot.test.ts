import { ShardedMerkleTree } from "../../src/evm/common/sharded-merkle-tree";
import { createSnapshot, SnapshotEntryInput } from "../../src/evm/index";
import { signers, storage } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, ethers } from "ethers";
import { MerkleTree } from "merkletreejs";

const chai = require("chai");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

chai.use(deepEqualInAnyOrder);

const { expect, assert } = chai;

global.fetch = require("cross-fetch");

describe("Snapshots", async () => {
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    abbyWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    w1: SignerWithAddress,
    w2: SignerWithAddress,
    w3: SignerWithAddress,
    w4: SignerWithAddress;

  let members;

  beforeEach(async () => {
    [adminWallet, samWallet, bobWallet, abbyWallet, w1, w2, w3, w4] = signers;
    members = [
      adminWallet.address,
      bobWallet.address,
      samWallet.address,
      abbyWallet.address,
      w1.address,
      w2.address,
      w3.address,
      w4.address,
    ];
  });

  it("should shard merkle tree", async () => {
    const input = members.map((address, i) => ({
      address,
      maxClaimable: BigNumber.from(i + 1).toString(),
    }));
    const result = await ShardedMerkleTree.buildAndUpload(input, 0, storage);
    const sm = await ShardedMerkleTree.fromUri(result.uri, storage);
    const proofs = await sm?.getProof(adminWallet.address);
    expect(proofs?.maxClaimable).to.equal("1");
    expect(proofs?.proof).length.gt(0);
  });

  it("should generate a valid merkle root from a list of addresses", async () => {
    const input = members.map((address) => ({
      address,
    }));
    const result = await createSnapshot(input, 0, storage);
    const merkleRoot = result.merkleRoot;
    assert.equal(
      merkleRoot,
      "0x8f8c4ebe208a3bc99d6b0cec30d92024a613d308c8e0e3b54fd4616f9bc87a8a",
    );
  });

  it("should generate valid proofs", async () => {
    const hashedLeafs = members.map((l) =>
      ShardedMerkleTree.hashEntry(
        SnapshotEntryInput.parse({
          address: l,
        }),
        0,
      ),
    );
    const tree = new MerkleTree(hashedLeafs, ethers.utils.keccak256, {
      sort: true,
    });
    const input = members.map((address) => ({
      address,
    }));
    const snapshot = await createSnapshot(input, 0, storage);
    for (const leaf of members) {
      const expectedProof = tree.getHexProof(
        ShardedMerkleTree.hashEntry(
          SnapshotEntryInput.parse({
            address: leaf,
          }),
          0,
        ),
      );

      const smt = await ShardedMerkleTree.fromUri(
        snapshot.snapshotUri,
        storage,
      );
      const actualProof = await smt?.getProof(leaf);
      assert.isDefined(actualProof);
      expect(actualProof?.proof).to.include.ordered.members(expectedProof);

      const verified = tree.verify(
        actualProof?.proof,
        ShardedMerkleTree.hashEntry({ ...actualProof }, 0),
        tree.getHexRoot(),
      );
      expect(verified).to.eq(true);
    }
  });

  it("should warn about duplicate leafs", async () => {
    const input = members.map((address, i) => ({
      address,
      maxClaimable: BigNumber.from(i + 1).toString(),
    }));
    const duplicateLeafs = input.concat({
      address: adminWallet.address,
      maxClaimable: "0",
    });

    try {
      await createSnapshot(duplicateLeafs, 0, storage);
    } catch (error) {
      expect(error).to.have.property("message", "DUPLICATE_LEAFS", "");
      return;
    }

    assert.fail(
      "should not reach this point, exception should have been thrown",
    );
  });
});
