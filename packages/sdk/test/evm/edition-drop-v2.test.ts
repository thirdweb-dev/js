import { NFTMetadataInput, NFTMetadataOrUri } from "../../src/core/schema/nft";
import {
  ClaimEligibility,
  EditionDrop,
  EditionDropInitializer,
  NATIVE_TOKEN_ADDRESS,
  TokenInitializer,
} from "../../src/evm";
import { expectError, sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect, use } from "chai";
import { BigNumber, constants } from "ethers";
import invariant from "tiny-invariant";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

use(deepEqualInAnyOrder);

describe("Edition Drop Contract (V2)", async () => {
  let bdContract: EditionDrop;
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    abbyWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    w1: SignerWithAddress,
    w2: SignerWithAddress,
    w3: SignerWithAddress,
    w4: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet, bobWallet, abbyWallet, w1, w2, w3, w4] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const address = await sdk.deployer.deployBuiltInContract(
      EditionDropInitializer.contractType,
      {
        name: `Testing edition drop from SDK`,
        description: "Test contract from tests",
        image:
          "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
        primary_sale_recipient: adminWallet.address,
        seller_fee_basis_points: 500,
        fee_recipient: constants.AddressZero,
        platform_fee_basis_points: 10,
        platform_fee_recipient: adminWallet.address,
      },
      "2",
    );
    bdContract = await sdk.getEditionDrop(address);
  });

  it("should estimate gas cost", async () => {
    const cost = await bdContract.estimator.gasCostOf("lazyMint", [
      1000,
      "mock://12398172398172389/0",
    ]);
    expect(parseFloat(cost)).gt(0);

    await bdContract.createBatch([{ name: `test$`, description: `desc` }]);
    await bdContract.claimConditions.set(0, [
      {
        price: 0.1,
      },
    ]);
    const claimTx = await bdContract.getClaimTransaction(
      adminWallet.address,
      0,
      1,
    );
    const cost2 = await claimTx.estimateGasCost();
    expect(parseFloat(cost2.ether)).gt(0);
  });

  it("comprehensive test", async () => {
    const metadata: NFTMetadataInput[] = [];
    for (let i = 0; i < 3; i++) {
      metadata.push({ name: `test${i}`, description: `desc${i}` });
    }
    await bdContract.createBatch(metadata);
    // claiming with default conditions
    await bdContract.claimConditions.set(0, [{}]);
    await bdContract.claim(0, 1);
    // claiming with max supply
    await bdContract.claimConditions.set(0, [
      {
        maxClaimableSupply: 2,
      },
    ]);
    try {
      await bdContract.claim(0, 2);
      expect.fail();
    } catch (e) {
      expectError(e, "exceed max mint supply");
    }
    await bdContract.claim(0, 1);
    // claiming with max per wallet
    await bdContract.claimConditions.set(0, [
      {
        maxClaimablePerWallet: 1,
      },
    ]);
    try {
      await bdContract.claim(0, 2);
      expect.fail();
    } catch (e) {
      expectError(e, "invalid quantity claimed");
    }
    await bdContract.claim(0, 1);
    expect((await bdContract.totalSupply(0)).toString()).eq("3");
  });

  it("comprehensive test with allowlist", async () => {
    const metadata: NFTMetadataOrUri[] = [];
    for (let i = 0; i < 6; i++) {
      metadata.push({ name: `test${i}`, description: `desc${i}` });
    }
    await bdContract.createBatch(metadata);
    // claiming with default conditions
    await bdContract.claimConditions.set(0, [
      {
        snapshot: [adminWallet.address],
      },
    ]);
    try {
      sdk.updateSignerOrProvider(bobWallet);
      await bdContract.claim(0, 1);
      expect.fail();
    } catch (e) {
      expectError(e, "No claim found");
    }
    sdk.updateSignerOrProvider(adminWallet);
    await bdContract.claim(0, 1);
    // claiming with max supply
    await bdContract.claimConditions.set(1, [
      {
        snapshot: [adminWallet.address],
        maxClaimableSupply: 1,
      },
    ]);
    try {
      await bdContract.claim(1, 2);
      expect.fail();
    } catch (e) {
      expectError(e, "exceed max mint supply");
    }
    await bdContract.claim(1, 1);
    // claiming with max per wallet
    await bdContract.claimConditions.set(2, [
      {
        snapshot: [adminWallet.address],
        maxClaimablePerWallet: 1,
      },
    ]);
    try {
      await bdContract.claim(2, 2);
      expect.fail();
    } catch (e) {
      expectError(e, "invalid quantity claimed");
    }
    await bdContract.claim(2, 1);
    // claiming with max per wallet in snapshot
    await bdContract.claimConditions.set(3, [
      {
        snapshot: [{ address: adminWallet.address, maxClaimable: 1 }],
        maxClaimablePerWallet: 0,
      },
    ]);
    try {
      await bdContract.claim(3, 2);
      expect.fail();
    } catch (e) {
      expectError(e, "invalid quantity proof");
    }
    await bdContract.claim(3, 1);
    try {
      await bdContract.claim(3, 1);
      expect.fail();
    } catch (e) {
      expectError(e, "proof claimed");
    }
  });

  it("should allow you to set claim conditions", async () => {
    await bdContract.createBatch([
      { name: "test", description: "test" },
      { name: "test", description: "test" },
    ]);
    await bdContract.claimConditions.set(BigNumber.from("0"), [{}]);
    const conditions = await bdContract.claimConditions.getAll(0);
    assert.lengthOf(conditions, 1);
  });

  it("should get all", async () => {
    await bdContract.createBatch([
      { name: "test", description: "test" },
      { name: "test", description: "test" },
    ]);
    const all = await bdContract.getAll();
    expect(all.length).to.eq(2);
  });

  it("allow all addresses in the merkle tree to claim", async () => {
    await bdContract.createBatch([
      {
        name: "test",
        description: "test",
      },
    ]);

    const testWallets: SignerWithAddress[] = [
      bobWallet,
      samWallet,
      abbyWallet,
      w1,
      w2,
      w3,
      w4,
    ];
    const members = testWallets.map((w) => w.address);

    await bdContract.claimConditions.set("0", [
      {
        maxClaimableSupply: 1000,
        snapshot: members,
      },
    ]);

    for (const member of testWallets) {
      await sdk.updateSignerOrProvider(member);
      await bdContract.claim("0", 1);
    }
    const bundle = await bdContract.get("0");
    assert(parseInt(bundle.supply) === testWallets.length);

    const claimers = await bdContract.history.getAllClaimerAddresses("0");
    expect(claimers.length).to.eq(testWallets.length);
    expect(claimers).to.include(bobWallet.address);
  });

  it("allow all addresses in the merkle tree to claim using useSnapshot", async () => {
    await bdContract.createBatch([
      {
        name: "test",
        description: "test",
      },
    ]);

    const testWallets: SignerWithAddress[] = [
      bobWallet,
      samWallet,
      abbyWallet,
      w1,
      w2,
      w3,
    ];
    const members = testWallets.map((w) => w.address);
    await bdContract.claimConditions.set("0", [
      {
        maxClaimableSupply: 1000,
        snapshot: members,
      },
    ]);
    testWallets.push(w4);

    for (const member of testWallets) {
      try {
        sdk.updateSignerOrProvider(member);
        await bdContract.claim("0", 1);
      } catch (e) {
        if (member !== w4) {
          throw e;
        }
      }
    }
    const bundle = await bdContract.get("0");
    assert(parseInt(bundle.supply) === testWallets.length - 1);
  });

  it("should return the newly minted tokens", async () => {
    const tokens = [
      {
        name: "test 0",
      },
      {
        name: "test 1",
      },
      {
        name: "test 2",
      },
      {
        name: "test 3",
      },
      {
        name: "test 4",
      },
    ];
    const result = await bdContract.createBatch(tokens);
    assert.lengthOf(result, tokens.length);
    for (const token of tokens) {
      const found = result.find(
        async (t) => (await t.data()).name === token.name,
      );
      assert.isDefined(found);
    }

    const moreTokens = [
      {
        name: "test 5",
      },
      {
        name: "test 6",
      },
    ];
    const moreResult = await bdContract.createBatch(moreTokens);
    assert.lengthOf(moreResult, moreTokens.length);
    for (const token of moreTokens) {
      const found = moreResult.find(
        async (t) => (await t.data()).name === token.name,
      );
      assert.isDefined(found);
    }
  });

  it("should allow setting max claims per wallet", async () => {
    await bdContract.createBatch([
      { name: "name", description: "description" },
    ]);
    await bdContract.claimConditions.set(0, [
      {
        snapshot: [
          { address: w1.address, maxClaimable: 2 },
          { address: w2.address, maxClaimable: 1 },
        ],
      },
    ]);
    await sdk.updateSignerOrProvider(w1);
    await bdContract.claim(0, 2);
    try {
      await sdk.updateSignerOrProvider(w2);
      await bdContract.claim(0, 2);
    } catch (e) {
      expectError(e, "invalid quantity proof");
    }
  });

  it("should allow a default claim condition to be used to claim", async () => {
    await bdContract.createBatch([
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

    await bdContract.claimConditions.set("0", [{}]);
    await bdContract.claim("0", 1);
  });

  it("should return addresses of all the claimers", async () => {
    await bdContract.createBatch([
      {
        name: "test 0",
      },
      {
        name: "test 1",
      },
    ]);

    await bdContract.claimConditions.set("0", [{}]);
    await bdContract.claimConditions.set("1", [{}]);
    await bdContract.claim("0", 1);

    await sdk.updateSignerOrProvider(samWallet);
    await bdContract.claim("0", 1);

    // TODO some asserts
    // const claimers = await bdContract.getAllClaimerAddresses("0");
    // expect(claimers).to.deep.equalInAnyOrder([
    //   samWallet.address,
    //   adminWallet.address,
    // ]);

    await sdk.updateSignerOrProvider(w1);
    await bdContract.claim("1", 1);
    await sdk.updateSignerOrProvider(w2);
    await bdContract.claim("1", 1);

    const ownedW1 = await bdContract.getOwned(w1.address);
    assert(ownedW1.length === 1);
    const ownedW2 = await bdContract.getOwned(w2.address);
    assert(ownedW2.length === 1);
  });

  it("should return the correct status if a token can be claimed", async () => {
    await bdContract.claimConditions.set("0", [
      {
        snapshot: [w1.address],
      },
    ]);

    await sdk.updateSignerOrProvider(w1);
    const canClaimW1 = await bdContract.claimConditions.canClaim("0", 1);
    assert.isTrue(canClaimW1, "w1 should be able to claim");

    await sdk.updateSignerOrProvider(w2);
    const canClaimW2 = await bdContract.claimConditions.canClaim("0", 1);
    assert.isFalse(canClaimW2, "w2 should not be able to claim");
  });

  it("Platform fees", async () => {
    const fees = await bdContract.platformFees.get();
    expect(fees.platform_fee_recipient).to.eq(adminWallet.address);
    expect(fees.platform_fee_basis_points).to.eq(10);

    await bdContract.platformFees.set({
      platform_fee_recipient: samWallet.address,
      platform_fee_basis_points: 500,
    });
    const fees2 = await bdContract.platformFees.get();
    expect(fees2.platform_fee_recipient).to.eq(samWallet.address);
    expect(fees2.platform_fee_basis_points).to.eq(500);
  });

  it("should allow custom overrides", async () => {
    bdContract.interceptor.overrideNextTransaction(() => ({
      nonce: 5000,
    }));
    try {
      await bdContract.createBatch([
        {
          name: "test",
          description: "test",
        },
      ]);
    } catch (e) {
      expectError(e, "Expected nonce to be");
    }
  });

  it("canClaim: 1 address", async () => {
    await bdContract.claimConditions.set("0", [
      {
        snapshot: [w1.address],
      },
    ]);

    assert.isTrue(
      await bdContract.claimConditions.canClaim("0", 1, w1.address),
      "can claim",
    );
    assert.isFalse(
      await bdContract.claimConditions.canClaim("0", 1, w2.address),
      "!can claim",
    );
  });

  it("canClaim: 3 address", async () => {
    await bdContract.claimConditions.set("0", [
      {
        snapshot: [
          w1.address.toUpperCase().replace("0X", "0x"),
          w2.address.toLowerCase(),
          w3.address,
        ],
      },
    ]);

    assert.isTrue(
      await bdContract.claimConditions.canClaim("0", 1, w1.address),
      "can claim",
    );
    assert.isTrue(
      await bdContract.claimConditions.canClaim("0", 1, w2.address),
      "can claim",
    );
    assert.isTrue(
      await bdContract.claimConditions.canClaim("0", 1, w3.address),
      "can claim",
    );
    assert.isFalse(
      await bdContract.claimConditions.canClaim("0", 1, bobWallet.address),
      "!can claim",
    );
  });

  it("should work when the token has a price", async () => {
    await bdContract.createBatch([
      {
        name: "test",
        description: "test",
      },
    ]);
    await bdContract.claimConditions.set("0", [
      {
        price: 1,
      },
    ]);
    await bdContract.claim("0", 1);
  });

  it("should set multiple claim conditions at once", async () => {
    await bdContract.createBatch([
      {
        name: "test1",
        description: "test1",
      },
      {
        name: "test2",
        description: "test2",
      },
    ]);
    await bdContract.claimConditions.setBatch([
      {
        tokenId: 0,
        claimConditions: [
          {
            price: 1,
          },
        ],
      },
      {
        tokenId: 1,
        claimConditions: [
          {
            price: 0.1,
            maxClaimableSupply: 1,
          },
        ],
      },
    ]);
    await bdContract.claim("0", 2);
    try {
      await bdContract.claim("1", 2);
    } catch (e) {
      expectError(e, "exceed max mint supply");
    }
  });

  describe("eligibility", () => {
    beforeEach(async () => {
      await bdContract.createBatch([
        {
          name: "test",
          description: "test",
        },
      ]);
    });

    it("should return false if there isn't an active claim condition", async () => {
      const reasons =
        await bdContract.claimConditions.getClaimIneligibilityReasons(
          "0",
          "0",
          bobWallet.address,
        );

      expect(reasons).to.include(ClaimEligibility.NoClaimConditionSet);
      assert.lengthOf(reasons, 1);
      const canClaim = await bdContract.claimConditions.canClaim(
        "0",
        "1",
        w1.address,
      );
      assert.isFalse(canClaim);
    });

    it("set claim condition in the future should not be claimable now", async () => {
      await bdContract.claimConditions.set(0, [
        {
          startTime: new Date(Date.now() + 60 * 60 * 24 * 1000),
        },
      ]);
      const canClaim = await bdContract.claimConditions.canClaim(0, 1);
      expect(canClaim).to.eq(false);
    });

    it("should check for the total supply", async () => {
      await bdContract.claimConditions.set("0", [
        {
          maxClaimableSupply: 1,
        },
      ]);

      const reasons =
        await bdContract.claimConditions.getClaimIneligibilityReasons(
          "0",
          "2",
          w1.address,
        );
      expect(reasons).to.include(ClaimEligibility.NotEnoughSupply);
      const canClaim = await bdContract.claimConditions.canClaim(
        "0",
        "2",
        w1.address,
      );
      assert.isFalse(canClaim);
    });

    it("should check if an address has valid merkle proofs", async () => {
      await bdContract.claimConditions.set("0", [
        {
          maxClaimableSupply: 1,
          snapshot: [w2.address, adminWallet.address],
        },
      ]);

      const reasons =
        await bdContract.claimConditions.getClaimIneligibilityReasons(
          "0",
          "1",
          w1.address,
        );
      expect(reasons).to.include(ClaimEligibility.AddressNotAllowed);
      const canClaim = await bdContract.claimConditions.canClaim(
        "0",
        "1",
        w1.address,
      );
      assert.isFalse(canClaim);
    });

    it("should check if its been long enough since the last claim", async () => {
      await bdContract.claimConditions.set("0", [
        {
          maxClaimableSupply: 10,
          waitInSeconds: 24 * 60 * 60,
        },
      ]);
      await sdk.updateSignerOrProvider(bobWallet);
      await bdContract.claim("0", 1);

      const reasons =
        await bdContract.claimConditions.getClaimIneligibilityReasons(
          "0",
          "1",
          bobWallet.address,
        );

      expect(reasons).to.include(
        ClaimEligibility.WaitBeforeNextClaimTransaction,
      );
      const canClaim = await bdContract.claimConditions.canClaim(
        "0",
        "1",
        bobWallet.address,
      );
      assert.isFalse(canClaim);
    });

    it("should check if an address has enough native currency", async () => {
      await bdContract.claimConditions.set("0", [
        {
          maxClaimableSupply: 10,
          price: "1000000000000000",
          currencyAddress: NATIVE_TOKEN_ADDRESS,
        },
      ]);
      await sdk.updateSignerOrProvider(bobWallet);

      const reasons =
        await bdContract.claimConditions.getClaimIneligibilityReasons(
          "0",
          "1",
          bobWallet.address,
        );

      expect(reasons).to.include(ClaimEligibility.NotEnoughTokens);
      const canClaim = await bdContract.claimConditions.canClaim(
        "0",
        "1",
        w1.address,
      );
      assert.isFalse(canClaim);
    });

    it("should check if an address has enough erc20 currency", async () => {
      const currency = await sdk.getToken(
        await sdk.deployer.deployBuiltInContract(
          TokenInitializer.contractType,
          {
            name: "test",
            symbol: "test",
            primary_sale_recipient: adminWallet.address,
          },
        ),
      );

      await bdContract.claimConditions.set("0", [
        {
          maxClaimableSupply: 10,
          price: "1000000000000000",
          currencyAddress: currency.getAddress(),
        },
      ]);
      await sdk.updateSignerOrProvider(bobWallet);

      const reasons =
        await bdContract.claimConditions.getClaimIneligibilityReasons(
          "0",
          "1",
          bobWallet.address,
        );

      expect(reasons).to.include(ClaimEligibility.NotEnoughTokens);
      const canClaim = await bdContract.claimConditions.canClaim(
        "0",
        "1",
        w1.address,
      );
      assert.isFalse(canClaim);
    });

    it("should return nothing if the claim is eligible", async () => {
      await bdContract.claimConditions.set("0", [
        {
          maxClaimableSupply: 10,
          price: "100",
          currencyAddress: NATIVE_TOKEN_ADDRESS,
          snapshot: [w1.address, w2.address, w3.address],
        },
      ]);

      const reasons =
        await bdContract.claimConditions.getClaimIneligibilityReasons(
          "0",
          "1",
          w1.address,
        );
      assert.lengthOf(reasons, 0);

      const canClaim = await bdContract.claimConditions.canClaim(
        "0",
        "1",
        w1.address,
      );
      assert.isTrue(canClaim);
    });
  });
  it("should allow you to update claim conditions", async () => {
    await bdContract.createBatch([
      { name: "test", description: "test" },
      { name: "test", description: "test" },
    ]);

    await bdContract.claimConditions.set(BigNumber.from("0"), [{}]);
    await bdContract.claimConditions.update(BigNumber.from("0"), 0, {});
    const conditions = await bdContract.claimConditions.getAll(0);
    assert.lengthOf(conditions, 1);
  });

  it("should return snapshot data on claim conditions", async () => {
    await bdContract.createBatch([
      { name: "test", description: "test" },
      { name: "test", description: "test" },
    ]);

    await bdContract.claimConditions.set(0, [
      {
        snapshot: [samWallet.address],
      },
    ]);
    const conditions = await bdContract.claimConditions.getAll(0, {
      withAllowList: true,
    });
    assert.lengthOf(conditions, 1);
    invariant(conditions[0].snapshot);
    expect(conditions[0].snapshot[0].address).to.eq(samWallet.address);
  });

  it("should be able to use claim as function expected", async () => {
    await bdContract.createBatch([
      {
        name: "test",
      },
    ]);
    await bdContract.claimConditions.set("0", [{}]);
    await bdContract.claim("0", 1);
    assert((await bdContract.getOwned()).length > 0);
  });

  it("should be able to use claimTo function as expected", async () => {
    await bdContract.createBatch([
      {
        name: "test",
      },
    ]);
    await bdContract.claimConditions.set("0", [{}]);
    await bdContract.claimTo(samWallet.address, "0", 3);
    assert((await bdContract.getOwned(samWallet.address)).length === 1);
    assert(
      (await bdContract.getOwned(samWallet.address))[0].owner ===
        samWallet.address,
    );
    assert(
      (await bdContract.getOwned(samWallet.address))[0].quantityOwned === "3",
    );
  });

  describe("setting merkle claim conditions", () => {
    it("should not overwrite existing merkle keys in the metadata", async () => {
      await bdContract.createBatch([
        { name: "test", description: "test" },
        { name: "test", description: "test" },
      ]);

      await bdContract.claimConditions.set("1", [
        {
          snapshot: [w1.address, w2.address, bobWallet.address],
        },
      ]);

      await bdContract.claimConditions.set("2", [
        {
          snapshot: [w3.address, w1.address, w2.address, adminWallet.address],
        },
      ]);

      const metadata = await bdContract.metadata.get();
      const merkle: { [key: string]: string } = metadata.merkle;
      assert.lengthOf(Object.keys(merkle), 2);
    });
  });
});
