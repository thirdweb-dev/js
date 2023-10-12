import { NFTMetadataInput, NFTMetadataOrUri } from "../../src/core/schema/nft";
import {
  ClaimEligibility,
  NATIVE_TOKEN_ADDRESS,
  NFTDrop,
  NFTDropInitializer,
  TokenInitializer,
} from "../../src/evm";
import { expectError, sdk, signers, storage } from "./before-setup";
import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ethers } from "ethers";
import invariant from "tiny-invariant";

describe("NFT Drop Contract (v3)", async () => {
  let dropContract: NFTDrop;
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    abbyWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    w1: SignerWithAddress,
    w2: SignerWithAddress,
    w3: SignerWithAddress,
    w4: SignerWithAddress;

  beforeEach(async () => {
    [adminWallet, samWallet, bobWallet, abbyWallet, w1, w2, w3, w4] = signers;
    const address = await sdk.deployer.deployBuiltInContract(
      NFTDropInitializer.contractType,
      {
        name: `Testing drop from SDK`,
        description: "Test contract from tests",
        image:
          "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
        primary_sale_recipient: adminWallet.address,
        seller_fee_basis_points: 500,
        fee_recipient: AddressZero,
        platform_fee_basis_points: 10,
        platform_fee_recipient: AddressZero,
      },
      "3",
    );
    dropContract = await sdk.getContract(address, "nft-drop");
  });

  it("should lazy mint with URI", async () => {
    const uri = await storage.upload({
      name: "Test1",
    });
    await dropContract.createBatch([uri]);
    const nft = await dropContract.get("0");
    assert.isNotNull(nft);
    assert.equal(nft.metadata.name, "Test1");
  });

  it("comprehensive test", async () => {
    const metadata: NFTMetadataOrUri[] = [];
    for (let i = 0; i < 10; i++) {
      metadata.push({ name: `test${i}`, description: `desc${i}` });
    }
    await dropContract.createBatch(metadata);
    // claiming with default conditions
    await dropContract.claimConditions.set([{}]);
    await dropContract.claim(1);
    // claiming with max supply
    await dropContract.claimConditions.set([
      {
        maxClaimableSupply: 2,
      },
    ]);
    try {
      await dropContract.claim(2);
      expect.fail("should not be able to claim 2 - maxSupply");
    } catch (e) {
      expectError(e, "exceed max claimable supply");
    }
    await dropContract.claim(1);
    // claiming with max per wallet
    await dropContract.claimConditions.set([
      {
        maxClaimablePerWallet: 1,
      },
    ]);
    try {
      await dropContract.claim(2);
      expect.fail("should not be able to claim 2 - maxClaimablePerWallet");
    } catch (e) {
      expectError(e, "invalid quantity");
    }
    await dropContract.claim(1);
    expect((await dropContract.totalClaimedSupply()).toString()).eq("3");
  });

  it("comprehensive test with allowlist", async () => {
    const metadata: NFTMetadataOrUri[] = [];
    for (let i = 0; i < 10; i++) {
      metadata.push({ name: `test${i}`, description: `desc${i}` });
    }
    await dropContract.createBatch(metadata);
    // claiming with default conditions
    await dropContract.claimConditions.set([
      {
        snapshot: [adminWallet.address],
      },
    ]);
    try {
      sdk.updateSignerOrProvider(bobWallet);
      await dropContract.claim(1);
      expect.fail("should not be able to claim - not in allowlist");
    } catch (e) {
      expectError(e, "No claim found");
    }
    sdk.updateSignerOrProvider(adminWallet);
    await dropContract.claim(1);

    // claiming with max supply
    await dropContract.claimConditions.set([
      {
        snapshot: [adminWallet.address],
        maxClaimableSupply: 2,
      },
    ]);
    try {
      await dropContract.claim(2);
      expect.fail("should not be able to claim - maxClaimableSupply");
    } catch (e) {
      expectError(e, "exceed max claimable supply");
    }
    await dropContract.claim(1);
    // claiming with max per wallet
    await dropContract.claimConditions.set([
      {
        snapshot: [adminWallet.address],
        maxClaimablePerWallet: 1,
      },
    ]);
    try {
      await dropContract.claim(2);
      expect.fail("should not be able to claim - maxClaimablePerWallet");
    } catch (e) {
      expectError(e, "invalid quantity");
    }
    await dropContract.claim(1);
    // claiming with max per wallet in snapshot
    await dropContract.claimConditions.set([
      {
        snapshot: [{ address: adminWallet.address, maxClaimable: 1 }],
        maxClaimablePerWallet: 0,
      },
    ]);
    try {
      await dropContract.claim(2);
      expect.fail("should not be able to claim - proof maxClaimable");
    } catch (e) {
      expectError(e, "invalid quantity proof");
    }
    await dropContract.claim(1);
    try {
      await dropContract.claim(1);
      expect.fail("should not be able to claim - proof used");
    } catch (e) {
      expectError(e, "proof claimed");
    }
  });

  it("should get and execute transaction task", async () => {
    await dropContract.createBatch([
      {
        name: "Test1",
      },
    ]);
    await dropContract.claimConditions.set([{}]);
    const tx = await dropContract.getClaimTransaction(adminWallet.address, 1);
    expect((await tx.estimateGasLimit()).toNumber()).gt(0);
    const sentTx = await tx.send();
    await sentTx.wait();
    const nft = await dropContract.get(0);
    expect(nft.owner).to.eq(adminWallet.address);
  });

  it("should allow a snapshot to be set", async () => {
    await dropContract.claimConditions.set([
      {
        startTime: new Date(Date.now() / 2),
        snapshot: [bobWallet.address, samWallet.address, abbyWallet.address],
        price: 1,
      },
      {
        startTime: new Date(),
        snapshot: [bobWallet.address],
      },
    ]);
    const metadata = await dropContract.metadata.get();
    const merkles = metadata.merkle;

    expect(merkles).have.property(
      "0xb1a60ad68b77609a455696695fbdd02b850d03ec285e7fe1f4c4093797457b24",
    );
    expect(merkles).have.property(
      "0xd89eb21bf7ee4dd07d88e8f90a513812d9d38ac390a58722762c9f3afc4e0feb",
    );

    const roots = (await dropContract.claimConditions.getAll()).map(
      (c) => c.merkleRootHash,
    );
    expect(roots).length(2);

    let proof = await dropContract.claimConditions.getClaimerProofs(
      bobWallet.address,
    );
    expect(proof?.address).to.eq(bobWallet.address);
    proof = await dropContract.claimConditions.getClaimerProofs(
      bobWallet.address,
      0,
    );
    expect(proof?.address).to.eq(bobWallet.address);
    proof = await dropContract.claimConditions.getClaimerProofs(
      samWallet.address,
    );
    expect(proof).to.eq(null);
    proof = await dropContract.claimConditions.getClaimerProofs(
      samWallet.address,
      0,
    );
    expect(proof?.address).to.eq(samWallet.address);
  });

  it("should return snapshot data on claim conditions", async () => {
    await dropContract.createBatch([
      { name: "test", description: "test" },
      { name: "test", description: "test" },
    ]);

    await dropContract.claimConditions.set([
      {
        snapshot: [samWallet.address],
      },
    ]);
    const conditions = await dropContract.claimConditions.getAll({
      withAllowList: true,
    });
    assert.lengthOf(conditions, 1);
    invariant(conditions[0].snapshot);
    expect(conditions[0].snapshot[0].address).to.eq(samWallet.address);
  });

  it("should remove merkles from the metadata when claim conditions are removed", async () => {
    await dropContract.claimConditions.set([
      {
        startTime: new Date(),
        waitInSeconds: 10,
        snapshot: [bobWallet.address, samWallet.address, abbyWallet.address],
      },
      {
        startTime: new Date(Date.now() + 60 * 60 * 1000),
        snapshot: [bobWallet.address],
      },
    ]);

    const metadata = await dropContract.metadata.get();
    const merkles = metadata.merkle;

    expect(merkles).have.property(
      "0xb1a60ad68b77609a455696695fbdd02b850d03ec285e7fe1f4c4093797457b24",
    );
    expect(merkles).have.property(
      "0xd89eb21bf7ee4dd07d88e8f90a513812d9d38ac390a58722762c9f3afc4e0feb",
    );

    const roots = (await dropContract.claimConditions.getAll()).map(
      (c) => c.merkleRootHash,
    );
    expect(roots).length(2);

    await dropContract.claimConditions.set([{}]);
    const newMetadata = await dropContract.metadata.get();
    const newMerkles = newMetadata.merkle;
    expect(JSON.stringify(newMerkles)).to.eq("{}");
  });

  it("allow all addresses in the merkle tree to claim", async () => {
    const testWallets: SignerWithAddress[] = [
      bobWallet,
      samWallet,
      abbyWallet,
      w1,
      w2,
      w3,
      w4,
    ];
    const members = testWallets.map((w, i) =>
      i % 3 === 0
        ? w.address.toLowerCase()
        : i % 3 === 1
        ? w.address.toUpperCase().replace("0X", "0x")
        : w.address,
    );

    await dropContract.claimConditions.set([
      {
        snapshot: members,
      },
    ]);
    const metadata = [] as NFTMetadataInput[];
    for (let i = 0; i < 10; i++) {
      metadata.push({
        name: `test ${i}`,
      });
    }
    await dropContract.createBatch(metadata);

    /**
     * Claiming 1 token with proofs: 0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9,0xb1a5bda84b83f7f014abcf0cf69cab5a4de1c3ececa8123a5e4aaacb01f63f83
     */

    for (const member of testWallets) {
      await sdk.updateSignerOrProvider(member);
      await dropContract.claim(1);
    }
  });

  it("allow one address in the merkle tree to claim", async () => {
    const testWallets: SignerWithAddress[] = [bobWallet];
    const members = testWallets.map((w) => w.address);

    await dropContract.claimConditions.set([
      {
        snapshot: members,
      },
    ]);

    const metadata = [] as NFTMetadataInput[];
    for (let i = 0; i < 2; i++) {
      metadata.push({
        name: `test ${i}`,
      });
    }
    await dropContract.createBatch(metadata);

    /**
     * Claiming 1 token with proofs: 0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9,0xb1a5bda84b83f7f014abcf0cf69cab5a4de1c3ececa8123a5e4aaacb01f63f83
     */

    for (const member of testWallets) {
      await sdk.updateSignerOrProvider(member);
      await dropContract.claim(1);
    }

    try {
      await sdk.updateSignerOrProvider(samWallet);
      await dropContract.claim(1);
      assert.fail("should have thrown");
    } catch (e) {
      // expected
    }
  });

  it("should correctly upload metadata for each nft", async () => {
    const metadatas = [] as NFTMetadataInput[];
    for (let i = 0; i < 100; i++) {
      metadatas.push({
        name: `test ${i}`,
      });
    }
    await dropContract.createBatch(metadatas);
    const all = await dropContract.getAll();
    expect(all.length).to.eq(100);
    await dropContract.claimConditions.set([{}]);
    await dropContract.claim(1);
    const claimed = await dropContract.getAllClaimed();
    const unclaimed = await dropContract.getAllUnclaimed({
      start: 0,
      count: 30,
    });
    expect(claimed.length).to.eq(1);
    expect(unclaimed.length).to.eq(30);
    expect(unclaimed[0].name).to.eq("test 1");
    expect(unclaimed[unclaimed.length - 1].name).to.eq("test 30");
  });

  it("should query total claimed supply even after claim reset", async () => {
    const metadatas = [] as NFTMetadataInput[];
    for (let i = 0; i < 100; i++) {
      metadatas.push({
        name: `test ${i}`,
      });
    }
    await dropContract.createBatch(metadatas);
    await dropContract.claimConditions.set([
      {
        maxClaimableSupply: 10,
      },
    ]);
    await dropContract.claim(5);
    await dropContract.claimConditions.set(
      [
        {
          maxClaimableSupply: 10,
        },
      ],
      true,
    );
    await dropContract.claim(10);
    expect((await dropContract.totalClaimedSupply()).toNumber()).to.eq(15);
    expect((await dropContract.getAllClaimed()).length).to.eq(15);
    expect((await dropContract.totalUnclaimedSupply()).toNumber()).to.eq(85);
    expect((await dropContract.getAllUnclaimed()).length).to.eq(85);
  });

  it("should correctly update total supply after burning", async () => {
    const metadatas = [] as NFTMetadataInput[];
    for (let i = 0; i < 20; i++) {
      metadatas.push({
        name: `test ${i}`,
      });
    }
    await dropContract.createBatch(metadatas);
    await dropContract.claimConditions.set([{}]);
    await dropContract.claim(10);
    const ts = await dropContract.totalSupply();
    expect(ts.toNumber()).to.eq(20);
    await dropContract.burn(0);
    const ts2 = await dropContract.totalSupply();
    expect(ts2.toNumber()).to.eq(20);
  });

  it("should not allow claiming to someone not in the merkle tree", async () => {
    await dropContract.claimConditions.set(
      [
        {
          snapshot: [bobWallet.address, samWallet.address, abbyWallet.address],
        },
      ],
      false,
    );
    await dropContract.createBatch([
      { name: "name", description: "description" },
    ]);

    await sdk.updateSignerOrProvider(w1);
    try {
      await dropContract.claim(1);
    } catch (err: any) {
      expect(err).to.have.property(
        "message",
        "No claim found for this address",
        "",
      );
      return;
    }
    assert.fail("should not reach this point, claim should have failed");
  });

  it("should allow claims with default settings", async () => {
    await dropContract.createBatch([
      { name: "name", description: "description" },
    ]);
    await dropContract.claimConditions.set([{}]);
    await dropContract.claim(1);
  });

  it("should allow setting max claims per wallet", async () => {
    await dropContract.createBatch([
      { name: "name", description: "description" },
      { name: "name2", description: "description" },
      { name: "name3", description: "description" },
      { name: "name4", description: "description" },
    ]);
    await dropContract.claimConditions.set([
      {
        snapshot: [
          { address: w1.address, maxClaimable: 2 },
          { address: w2.address, maxClaimable: 1 },
        ],
      },
    ]);
    await sdk.updateSignerOrProvider(w1);
    const tx = await dropContract.claim(2);
    expect(tx.length).to.eq(2);
    try {
      await sdk.updateSignerOrProvider(w2);
      await dropContract.claim(2);
    } catch (e) {
      expectError(e, "invalid quantity proof");
    }
  });

  it("should return the newly claimed token", async () => {
    await dropContract.claimConditions.set([{}]);
    await dropContract.createBatch([
      {
        name: "test 0",
      },
      {
        name: "test 1",
      },
      {
        name: "test 2",
      },
    ]);

    try {
      await dropContract.createBatch([
        {
          name: "test 0",
        },
        {
          name: "test 1",
        },
        {
          name: "test 2",
        },
      ]);
    } catch (err) {
      expect(err).to.have.property("message", "Batch already created!", "");
    }

    const token = await dropContract.claim(2);
    assert.lengthOf(token, 2);
  });

  describe("eligibility", () => {
    beforeEach(async () => {
      await dropContract.createBatch([
        {
          name: "test",
          description: "test",
        },
      ]);
    });

    it("should return false if there isn't an active claim condition", async () => {
      const reasons =
        await dropContract.claimConditions.getClaimIneligibilityReasons(
          "1",
          bobWallet.address,
        );

      expect(reasons).to.include(ClaimEligibility.NoClaimConditionSet);
      assert.lengthOf(reasons, 1);
      const canClaim = await dropContract.claimConditions.canClaim(
        1,
        w1.address,
      );
      assert.isFalse(canClaim);
    });

    it("should check for the total supply", async () => {
      await dropContract.claimConditions.set([{ maxClaimableSupply: 1 }]);

      const reasons =
        await dropContract.claimConditions.getClaimIneligibilityReasons(
          "2",
          w1.address,
        );
      expect(reasons).to.include(ClaimEligibility.NotEnoughSupply);
      const canClaim = await dropContract.claimConditions.canClaim(
        2,
        w1.address,
      );
      assert.isFalse(canClaim);
    });

    it("should check if an address has valid merkle proofs", async () => {
      await dropContract.claimConditions.set([
        {
          maxClaimableSupply: 1,
          snapshot: [w2.address, adminWallet.address],
        },
      ]);

      const reasons =
        await dropContract.claimConditions.getClaimIneligibilityReasons(
          "1",
          w1.address,
        );
      expect(reasons).to.include(ClaimEligibility.AddressNotAllowed);
      const canClaim = await dropContract.claimConditions.canClaim(
        1,
        w1.address,
      );
      assert.isFalse(canClaim);
    });

    it("should check if its been long enough since the last claim", async () => {
      await dropContract.claimConditions.set([
        {
          maxClaimableSupply: 10,
          waitInSeconds: 24 * 60 * 60,
        },
      ]);
      await sdk.updateSignerOrProvider(bobWallet);
      await dropContract.claim(1);

      const reasons =
        await dropContract.claimConditions.getClaimIneligibilityReasons(
          "1",
          bobWallet.address,
        );

      expect(reasons).to.include(
        ClaimEligibility.WaitBeforeNextClaimTransaction,
      );
      const canClaim = await dropContract.claimConditions.canClaim(1);
      assert.isFalse(canClaim);
    });

    it("should check if an address has enough native currency", async () => {
      await dropContract.claimConditions.set([
        {
          maxClaimableSupply: 10,
          price: "1000000000000000",
          currencyAddress: NATIVE_TOKEN_ADDRESS,
        },
      ]);
      await sdk.updateSignerOrProvider(bobWallet);

      const reasons =
        await dropContract.claimConditions.getClaimIneligibilityReasons(
          "1",
          bobWallet.address,
        );

      expect(reasons).to.include(ClaimEligibility.NotEnoughTokens);
      const canClaim = await dropContract.claimConditions.canClaim(1);
      assert.isFalse(canClaim);
    });

    it("should check if an address has enough erc20 currency", async () => {
      const currencyAddress = await sdk.deployer.deployBuiltInContract(
        TokenInitializer.contractType,
        {
          name: "test",
          symbol: "test",
          primary_sale_recipient: adminWallet.address,
        },
      );

      await dropContract.claimConditions.set([
        {
          maxClaimableSupply: 10,
          price: "1000000000000000",
          currencyAddress,
        },
      ]);
      await sdk.updateSignerOrProvider(bobWallet);

      const reasons =
        await dropContract.claimConditions.getClaimIneligibilityReasons(
          "1",
          bobWallet.address,
        );

      expect(reasons).to.include(ClaimEligibility.NotEnoughTokens);
      const canClaim = await dropContract.claimConditions.canClaim(1);
      assert.isFalse(canClaim);
    });

    it("should return nothing if the claim is eligible", async () => {
      await dropContract.claimConditions.set([
        {
          maxClaimableSupply: 10,
          price: "100",
          currencyAddress: NATIVE_TOKEN_ADDRESS,
          snapshot: [w1.address, w2.address, w3.address],
        },
      ]);

      const reasons =
        await dropContract.claimConditions.getClaimIneligibilityReasons(
          "1",
          w1.address,
        );
      assert.lengthOf(reasons, 0);

      const canClaim = await dropContract.claimConditions.canClaim(
        "1",
        w1.address,
      );
      assert.isTrue(canClaim);
    });
  });

  it("should verify claim correctly after resetting claim conditions", async () => {
    await dropContract.claimConditions.set([
      {
        snapshot: [w1.address],
      },
    ]);

    const reasons =
      await dropContract.claimConditions.getClaimIneligibilityReasons(
        "1",
        w2.address,
      );
    expect(reasons).to.contain(ClaimEligibility.AddressNotAllowed);

    await dropContract.claimConditions.set([{}]);
    const reasons2 =
      await dropContract.claimConditions.getClaimIneligibilityReasons(
        "1",
        w2.address,
      );
    expect(reasons2.length).to.eq(0);
  });

  it("should verify claim correctly after updating claim conditions", async () => {
    await dropContract.claimConditions.set([
      {
        snapshot: [w1.address],
      },
    ]);

    const reasons =
      await dropContract.claimConditions.getClaimIneligibilityReasons(
        "1",
        w2.address,
      );
    expect(reasons).to.contain(ClaimEligibility.AddressNotAllowed);

    await dropContract.claimConditions.update(0, {
      snapshot: [w1.address, w2.address],
    });
    const reasons2 =
      await dropContract.claimConditions.getClaimIneligibilityReasons(
        "1",
        w2.address,
      );
    expect(reasons2.length).to.eq(0);
  });

  it("should allow you to update claim conditions", async () => {
    await dropContract.claimConditions.set([{}]);

    const conditions = await dropContract.claimConditions.getAll();
    await dropContract.claimConditions.set([{}]);
    assert.lengthOf(conditions, 1);
  });
  it("should be able to use claim as function expected", async () => {
    await dropContract.createBatch([
      {
        name: "test",
      },
    ]);
    await dropContract.claimConditions.set([{}]);
    await dropContract.claim(1);
    assert((await dropContract.getOwned()).length === 1);
    assert((await dropContract.getOwnedTokenIds()).length === 1);
  });

  it("should be able to use claimTo function as expected", async () => {
    await dropContract.claimConditions.set([{}]);
    await dropContract.createBatch([
      {
        name: "test",
      },
    ]);
    await dropContract.claimTo(samWallet.address, 1);
    assert((await dropContract.getOwned(samWallet.address)).length === 1);
    assert(
      (await dropContract.getOwnedTokenIds(samWallet.address)).length === 1,
    );
  });

  it("canClaim: 1 address", async () => {
    const metadata = [] as NFTMetadataInput[];
    for (let i = 0; i < 10; i++) {
      metadata.push({
        name: `test ${i}`,
      });
    }
    await dropContract.createBatch(metadata);

    await dropContract.claimConditions.set([{ snapshot: [w1.address] }]);

    assert.isTrue(
      await dropContract.claimConditions.canClaim(1, w1.address),
      "can claim",
    );
    assert.isFalse(
      await dropContract.claimConditions.canClaim(1, w2.address),
      "!can claim",
    );
  });

  it("canClaim: 3 address", async () => {
    const metadata = [] as NFTMetadataInput[];
    for (let i = 0; i < 10; i++) {
      metadata.push({
        name: `test ${i}`,
      });
    }
    await dropContract.createBatch(metadata);

    const members = [
      w1.address.toUpperCase().replace("0X", "0x"),
      w2.address.toLowerCase(),
      w3.address,
    ];
    await dropContract.claimConditions.set([
      {
        snapshot: members,
      },
    ]);

    assert.isTrue(
      await dropContract.claimConditions.canClaim(1, w1.address),
      "can claim",
    );
    assert.isTrue(
      await dropContract.claimConditions.canClaim(1, w2.address),
      "can claim",
    );
    assert.isTrue(
      await dropContract.claimConditions.canClaim(1, w3.address),
      "can claim",
    );
    assert.isFalse(
      await dropContract.claimConditions.canClaim(1, bobWallet.address),
      "!can claim",
    );
  });

  it("set claim condition and reset claim condition", async () => {
    await dropContract.claimConditions.set([
      { startTime: new Date(Date.now() / 2) },
      { startTime: new Date() },
    ]);
    expect((await dropContract.claimConditions.getAll()).length).to.be.equal(2);

    await dropContract.claimConditions.set([]);
    expect((await dropContract.claimConditions.getAll()).length).to.be.equal(0);
  });

  it("set claim condition with snapshot and remove it afterwards", async () => {
    await dropContract.claimConditions.set([{ snapshot: [samWallet.address] }]);
    expect(
      await dropContract.claimConditions.canClaim(1, samWallet.address),
    ).to.eq(true);
    expect(
      await dropContract.claimConditions.canClaim(1, bobWallet.address),
    ).to.eq(false);
    const cc = await dropContract.claimConditions.getActive();
    await dropContract.claimConditions.set([
      {
        merkleRootHash: cc.merkleRootHash,
        snapshot: undefined,
      },
    ]);
    expect(
      await dropContract.claimConditions.canClaim(1, samWallet.address),
    ).to.eq(true);
    expect(
      await dropContract.claimConditions.canClaim(1, bobWallet.address),
    ).to.eq(true);
  });

  it("update claim condition to remove snapshot", async () => {
    await dropContract.claimConditions.set([{ snapshot: [samWallet.address] }]);
    expect(
      await dropContract.claimConditions.canClaim(1, samWallet.address),
    ).to.eq(true);
    expect(
      await dropContract.claimConditions.canClaim(1, bobWallet.address),
    ).to.eq(false);
    await dropContract.claimConditions.update(0, {
      snapshot: [],
    });
    expect(
      await dropContract.claimConditions.canClaim(1, samWallet.address),
    ).to.eq(true);
    expect(
      await dropContract.claimConditions.canClaim(1, bobWallet.address),
    ).to.eq(true);
  });

  it("set claim condition and update claim condition", async () => {
    await dropContract.claimConditions.set([
      {
        startTime: new Date(Date.now() / 2),
        maxClaimableSupply: 1,
        price: 0.15,
      },
      { startTime: new Date(), waitInSeconds: 60 },
    ]);
    expect((await dropContract.claimConditions.getAll()).length).to.be.equal(2);

    await dropContract.claimConditions.update(0, { waitInSeconds: 10 });
    let updatedConditions = await dropContract.claimConditions.getAll();
    expect(updatedConditions[0].maxClaimableSupply).to.be.deep.equal("1");
    expect(updatedConditions[0].price).to.be.deep.equal(
      ethers.utils.parseUnits("0.15"),
    );
    expect(updatedConditions[0].waitInSeconds).to.be.deep.equal(
      BigNumber.from(10),
    );
    expect(updatedConditions[1].waitInSeconds).to.be.deep.equal(
      BigNumber.from(60),
    );

    await dropContract.claimConditions.update(1, {
      maxClaimableSupply: 10,
      waitInSeconds: 10,
    });
    updatedConditions = await dropContract.claimConditions.getAll();
    expect(updatedConditions[0].maxClaimableSupply).to.be.deep.equal("1");
    expect(updatedConditions[1].maxClaimableSupply).to.be.deep.equal("10");
    expect(updatedConditions[1].waitInSeconds).to.be.deep.equal(
      BigNumber.from(10),
    );
  });

  it("set claim condition and update claim condition with diff timestamps should reorder", async () => {
    await dropContract.claimConditions.set([
      { startTime: new Date(Date.now() / 2), maxClaimableSupply: 1 },
      { startTime: new Date(), maxClaimableSupply: 2 },
    ]);
    expect((await dropContract.claimConditions.getAll()).length).to.be.equal(2);

    await dropContract.claimConditions.update(0, {
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    // max quantities should be inverted now
    const updatedConditions = await dropContract.claimConditions.getAll();
    expect(updatedConditions[0].maxClaimableSupply).to.be.deep.equal("2");
    expect(updatedConditions[1].maxClaimableSupply).to.be.deep.equal("1");
  });

  it("set claim condition in the future should not be claimable now", async () => {
    await dropContract.claimConditions.set([
      {
        startTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
      },
    ]);
    const canClaim = await dropContract.claimConditions.canClaim(1);
    expect(canClaim).to.eq(false);
  });

  describe("Delay Reveal", () => {
    it("metadata should reveal correctly", async () => {
      await dropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #1",
        },
        [{ name: "NFT #1" }, { name: "NFT #2" }],
        "my secret password",
      );

      expect((await dropContract.get("0")).metadata.name).to.be.equal(
        "Placeholder #1",
      );

      await dropContract.revealer.reveal(0, "my secret password");

      expect((await dropContract.get("0")).metadata.name).to.be.equal("NFT #1");
    });

    it("different reveal order and should return correct unreveal list", async () => {
      await dropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #1",
        },
        [
          {
            name: "NFT #1",
          },
          {
            name: "NFT #2",
          },
        ],
        "my secret key",
      );

      await dropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #2",
        },
        [
          {
            name: "NFT #3",
          },
          {
            name: "NFT #4",
          },
        ],
        "my secret key",
      );

      await dropContract.createBatch([
        {
          name: "NFT #00",
        },
        {
          name: "NFT #01",
        },
      ]);

      await dropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #3",
        },
        [
          {
            name: "NFT #5",
          },
          {
            name: "NFT #6",
          },
          {
            name: "NFT #7",
          },
        ],
        "my secret key",
      );

      let unrevealList = await dropContract.revealer.getBatchesToReveal();
      expect(unrevealList.length).to.be.equal(3);
      expect(unrevealList[0].batchId.toNumber()).to.be.equal(0);
      expect(unrevealList[0].placeholderMetadata.name).to.be.equal(
        "Placeholder #1",
      );
      expect(unrevealList[1].batchId.toNumber()).to.be.equal(1);
      expect(unrevealList[1].placeholderMetadata.name).to.be.equal(
        "Placeholder #2",
      );
      // skipped 2 because it is a revealed batch
      expect(unrevealList[2].batchId.toNumber()).to.be.equal(3);
      expect(unrevealList[2].placeholderMetadata.name).to.be.equal(
        "Placeholder #3",
      );

      await dropContract.revealer.reveal(
        unrevealList[0].batchId,
        "my secret key",
      );

      unrevealList = await dropContract.revealer.getBatchesToReveal();
      expect(unrevealList.length).to.be.equal(2);
      expect(unrevealList[0].batchId.toNumber()).to.be.equal(1);
      expect(unrevealList[0].placeholderMetadata.name).to.be.equal(
        "Placeholder #2",
      );
      expect(unrevealList[1].batchId.toNumber()).to.be.equal(3);
      expect(unrevealList[1].placeholderMetadata.name).to.be.equal(
        "Placeholder #3",
      );

      await dropContract.revealer.reveal(
        unrevealList[unrevealList.length - 1].batchId,
        "my secret key",
      );

      unrevealList = await dropContract.revealer.getBatchesToReveal();
      expect(unrevealList.length).to.be.equal(1);
      expect(unrevealList[0].batchId.toNumber()).to.be.equal(1);
      expect(unrevealList[0].placeholderMetadata.name).to.be.equal(
        "Placeholder #2",
      );
    });

    it("should not be able to re-used published password for next batch", async () => {
      await dropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #1",
        },
        [{ name: "NFT #1" }, { name: "NFT #2" }],
        "my secret password",
      );
      await dropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #2",
        },
        [{ name: "NFT #3" }, { name: "NFT #4" }],
        "my secret password",
      );
      await dropContract.revealer.reveal(0, "my secret password");
      const transactions =
        (await adminWallet.provider?.getBlockWithTransactions("latest"))
          ?.transactions || [];

      const [index, key] = dropContract.encoder.decode(
        "reveal",
        transactions[0].data,
      );

      // re-using broadcasted _key to decode :)
      try {
        await dropContract.revealer.reveal(index.add(1), key);
        assert.fail("should not be able to re-used published password");
      } catch (e) {
        expect((e as Error).message).to.be.equal("invalid password");
      }

      // original password should work
      await dropContract.revealer.reveal(1, "my secret password");
    });
  });
});
