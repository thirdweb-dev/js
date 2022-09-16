import { createSnapshot, Snapshot } from "../src/index";
import { MockStorage } from "./mock/MockStorage";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

const chai = require("chai");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

chai.use(deepEqualInAnyOrder);

const { expect, assert } = chai;

global.fetch = require("cross-fetch");

describe("Snapshots", async () => {
  let snapshot: Snapshot;
  let uri: string;
  let merkleRoot: string;

  const leafs = [
    "0xE79ee09bD47F4F5381dbbACaCff2040f2FbC5803",
    "0x99703159fbE079e1a48B53039a5e52e7b2d9E559",
    "0x38641f11406E513A187d40600a13C9F921db23c2",
    "0x14fb3a9B317612ddc6d6Cc3c907CD9F2Aa091eE7",
  ];

  const input = leafs.map((address) => ({
    address,
    maxClaimable: 0,
  }));

  let storage: ThirdwebStorage;

  beforeEach(async () => {
    storage = new MockStorage();
  });

  beforeEach(async () => {
    const result = await createSnapshot(input, 0, storage);
    snapshot = result.snapshot;
    uri = result.snapshotUri;
    merkleRoot = result.merkleRoot;
  });

  it("should generate a valid merkle root from a list of addresses", async () => {
    assert.equal(
      merkleRoot,
      "0xe0c95ec2a9cc03bb25cdf2f3c9092a00698716373e4e34715498a68167fe4acd",
    );
  });

  it("should warn about duplicate leafs", async () => {
    const duplicateLeafs = input.concat({
      address: "0xE79ee09bD47F4F5381dbbACaCff2040f2FbC5803",
      maxClaimable: 0,
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

  it("should contain the same number of claims as there are leafs", () => {
    assert.lengthOf(snapshot.claims, leafs.length);
  });

  it("should contain a proof for every claim", () => {
    assert.lengthOf(snapshot.claims, leafs.length);

    snapshot.claims.forEach((claim) => {
      assert.isNotEmpty(claim.proof);
    });
  });

  it("should contain a claim for each leaf", () => {
    leafs.forEach((leaf) => {
      assert.notEqual(
        snapshot.claims.find((c) => c.address === leaf),
        undefined,
      );
    });
  });

  it("should upload the snapshot to storage", async () => {
    const rawSnapshotJson = await storage.get(uri);
    expect(rawSnapshotJson).to.deep.equalInAnyOrder(snapshot);
  });
});
