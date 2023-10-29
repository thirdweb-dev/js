import { SnapshotEntryInput } from "../../src";
import { createSnapshot } from "../../src/evm/common/snapshots";
import {
  ShardedMerkleTree,
  SnapshotFormatVersion,
} from "../../src/evm/common/sharded-merkle-tree";
import { sdk, signers, storage } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, ethers } from "ethers";
import { MerkleTree } from "@thirdweb-dev/merkletree";

const chai = require("chai");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

chai.use(deepEqualInAnyOrder);

const { expect, assert } = chai;

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

  [SnapshotFormatVersion.V1, SnapshotFormatVersion.V2].forEach(
    (snapshotVersion) => {
      it("should shard merkle tree: " + snapshotVersion, async () => {
        const input = members.map((address, i) => ({
          address,
          maxClaimable: BigNumber.from(i + 1).toString(),
        }));
        const result = await ShardedMerkleTree.buildAndUpload(
          input,
          0,
          sdk.getProvider(),
          storage,
          snapshotVersion,
        );
        const sm = await ShardedMerkleTree.fromUri(result.uri, storage);
        const proofs = await sm?.getProof(
          adminWallet.address,
          sdk.getProvider(),
          snapshotVersion,
        );
        expect(proofs?.maxClaimable).to.equal("1");
        expect(proofs?.proof).length.gt(0);
      });
    },
  );

  it("should generate a valid merkle root from a list of addresses", async () => {
    const input = members.map((address) => ({
      address,
    }));
    const result = await createSnapshot(
      input,
      0,
      sdk.getProvider(),
      storage,
      SnapshotFormatVersion.V1,
    );
    const merkleRoot = result.merkleRoot;
    assert.equal(
      merkleRoot,
      "0x7c55d9d851d24cc0a32d49d22cda5e0162ce54cdde1773e9d8fb31e02c8818f4",
    );
  });

  [SnapshotFormatVersion.V1, SnapshotFormatVersion.V2].forEach(
    (snapshotVersion) => {
      it("should generate valid proofs:" + snapshotVersion, async () => {
        const hashedLeafs = await Promise.all(
          members.map(async (l) =>
            ShardedMerkleTree.hashEntry(
              await SnapshotEntryInput.parseAsync({
                address: l,
              }),
              0,
              18,
              snapshotVersion,
            ),
          ),
        );
        const tree = new MerkleTree(hashedLeafs, ethers.utils.keccak256, {
          sort: true,
        });
        const input = members.map((address) => ({
          address,
        }));
        const snapshot = await createSnapshot(
          input,
          0,
          sdk.getProvider(),
          storage,
          snapshotVersion,
        );
        for (const leaf of members) {
          const expectedProof = tree.getHexProof(
            ShardedMerkleTree.hashEntry(
              await SnapshotEntryInput.parseAsync({
                address: leaf,
              }),
              0,
              18,
              snapshotVersion,
            ),
          );

          const smt = await ShardedMerkleTree.fromUri(
            snapshot.snapshotUri,
            storage,
          );
          const actualProof = await smt?.getProof(
            leaf,
            sdk.getProvider(),
            snapshotVersion,
          );
          assert.isDefined(actualProof);
          expect(actualProof?.proof).to.include.ordered.members(expectedProof);

          const verified = tree.verify(
            actualProof?.proof as any,
            ShardedMerkleTree.hashEntry(
              // @ts-expect-error - TODO: fix this
              { ...actualProof },
              0,
              18,
              snapshotVersion,
            ),
            tree.getHexRoot(),
          );
          expect(verified).to.eq(true);
        }
      });
    },
  );

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
      await createSnapshot(
        duplicateLeafs,
        0,
        sdk.getProvider(),
        storage,
        SnapshotFormatVersion.V1,
      );
    } catch (error) {
      expect(error).to.have.property("message", "DUPLICATE_LEAFS", "");
      return;
    }

    assert.fail(
      "should not reach this point, exception should have been thrown",
    );
  });
});
