import { ShardedMerkleTree } from "../../src/evm/common/sharded-merkle-tree";
import { createSnapshot, Snapshot } from "../../src/evm/index";
import { MockStorage } from "./mock/MockStorage";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber } from "ethers";

const chai = require("chai");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

chai.use(deepEqualInAnyOrder);

const { expect, assert } = chai;

global.fetch = require("cross-fetch");

describe("Snapshots", async () => {
  let merkleRoot: string;

  const leafs = [
    "0xE79ee09bD47F4F5381dbbACaCff2040f2FbC5803",
    "0x99703159fbE079e1a48B53039a5e52e7b2d9E559",
    "0x38641f11406E513A187d40600a13C9F921db23c2",
    "0x14fb3a9B317612ddc6d6Cc3c907CD9F2Aa091eE7",
  ];

  const input = leafs.map((address, i) => ({
    address,
    maxClaimable: BigNumber.from(i + 1).toString(),
  }));

  let storage: ThirdwebStorage;

  beforeEach(async () => {
    storage = MockStorage();
  });

  beforeEach(async () => {
    const result = await createSnapshot(input, 0, storage);
    merkleRoot = result.merkleRoot;
  });

  it("should shard merkle tree", async () => {
    const result = await ShardedMerkleTree.buildAndUpload(input, 0, storage);
    const sm = await ShardedMerkleTree.fromUri(result.uri, storage);
    const proofs = await sm?.getProof(
      "0xE79ee09bD47F4F5381dbbACaCff2040f2FbC5803",
    );
    expect(proofs?.maxClaimable).to.equal("1");
    expect(proofs?.proof).length(2);
  });

  it("should generate a valid merkle root from a list of addresses", async () => {
    assert.equal(
      merkleRoot,
      "0x8ef5aa32e8d987fe1e5b93155939ebfbb897746f476f0a97ad5354aa5317c751",
    );
  });

  it("should warn about duplicate leafs", async () => {
    const duplicateLeafs = input.concat({
      address: "0xE79ee09bD47F4F5381dbbACaCff2040f2FbC5803",
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
