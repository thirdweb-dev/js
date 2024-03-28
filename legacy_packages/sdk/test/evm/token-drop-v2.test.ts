import {
  ClaimEligibility,
  NATIVE_TOKEN_ADDRESS,
  TokenDrop,
  TokenDropInitializer,
  TokenInitializer,
} from "../../src/evm";
import { expectError, sdk, signers } from "./before-setup";
import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import invariant from "tiny-invariant";

describe("Token Drop Contract (v2)", async () => {
  let dropContract: TokenDrop;
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
    sdk.updateSignerOrProvider(adminWallet);
    const address = await sdk.deployer.deployBuiltInContract(
      TokenDropInitializer.contractType,
      {
        name: `Testing drop from SDK`,
        description: "Test contract from tests",
        image:
          "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
        primary_sale_recipient: adminWallet.address,
        platform_fee_basis_points: 10,
        platform_fee_recipient: AddressZero,
      },
      "2",
    );
    dropContract = await sdk.getContract(address, "token-drop");
  });

  it("comprehensive test", async () => {
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
      expectError(e, "exceed max mint supply");
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
    expect((await dropContract.totalSupply()).displayValue).eq("3.0");
  });

  it("comprehensive test with allowlist", async () => {
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
      expectError(e, "exceed max mint supply");
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
  });

  it("should return snapshot data on claim conditions", async () => {
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

    for (const member of testWallets) {
      await sdk.updateSignerOrProvider(member);
      await dropContract.claim(1.2);
      const balance = await dropContract.balanceOf(member.address);
      expect(balance.displayValue).to.eq("1.2");
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

  it("should not allow claiming to someone not in the merkle tree", async () => {
    await dropContract.claimConditions.set(
      [
        {
          snapshot: [bobWallet.address, samWallet.address, abbyWallet.address],
        },
      ],
      false,
    );
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
    await dropContract.claimConditions.set([{}]);
    await dropContract.claim(142.69);
    const balance = await dropContract.balance();
    expect(balance.displayValue).to.eq("142.69");
  });

  it("should allow claiming with a price", async () => {
    await dropContract.claimConditions.set([
      {
        price: 0.1,
      },
    ]);
    await dropContract.claim(100);
    const balance = await dropContract.balance();
    expect(balance.displayValue).to.eq("100.0");
  });

  it("should allow setting max claims per wallet", async () => {
    await dropContract.claimConditions.set([
      {
        snapshot: [
          { address: w1.address, maxClaimable: "2.1" },
          { address: w2.address, maxClaimable: 1 },
        ],
      },
    ]);
    await sdk.updateSignerOrProvider(w1);
    await dropContract.claim(2);
    const balance = await dropContract.balance();
    expect(balance.displayValue).to.eq("2.0");
    try {
      await sdk.updateSignerOrProvider(w2);
      await dropContract.claim(2);
    } catch (e) {
      expectError(e, "invalid quantity proof");
    }
  });

  describe("eligibility", () => {
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
      await dropContract.claimConditions.set([{ maxClaimableSupply: 1.2 }]);

      const reasons =
        await dropContract.claimConditions.getClaimIneligibilityReasons(
          "1.8",
          w1.address,
        );
      expect(reasons).to.include(ClaimEligibility.NotEnoughSupply);
      const canClaim = await dropContract.claimConditions.canClaim(
        1.8,
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

    it("should transform quantities back to readable values", async () => {
      await dropContract.claimConditions.set([
        {
          maxClaimableSupply: "10.8",
          maxClaimablePerWallet: "1.2",
        },
      ]);
      const active = await dropContract.claimConditions.getActive();
      expect(active.maxClaimableSupply).to.be.equal("10.8");
      expect(active.maxClaimablePerWallet).to.be.equal("1.2");
    });

    it("should check if its been long enough since the last claim", async () => {
      await dropContract.claimConditions.set([
        {
          maxClaimableSupply: "10.8",
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
      const canClaim = await dropContract.claimConditions.canClaim(
        1,
        bobWallet.address,
      );
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
      const canClaim = await dropContract.claimConditions.canClaim(
        1,
        bobWallet.address,
      );
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
      const canClaim = await dropContract.claimConditions.canClaim(
        1,
        bobWallet.address,
      );
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

  it("should be able to use claimTo function as expected", async () => {
    await dropContract.claimConditions.set([{}]);
    await dropContract.claimTo(samWallet.address, 1);
    assert(
      (await dropContract.balanceOf(samWallet.address)).displayValue === "1.0",
    );
  });

  it("canClaim: 1 address", async () => {
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

  it("set claim condition and update claim condition", async () => {
    await dropContract.claimConditions.set([
      { startTime: new Date(Date.now() / 2), maxClaimableSupply: 1.2 },
      { startTime: new Date(), waitInSeconds: 60 },
    ]);
    const oldConditions = await dropContract.claimConditions.getAll();
    expect(oldConditions.length).to.be.equal(2);
    await dropContract.claimConditions.update(0, { waitInSeconds: 10 });
    let updatedConditions = await dropContract.claimConditions.getAll();
    expect(updatedConditions[0].maxClaimableSupply).to.be.deep.equal("1.2");
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
    expect(updatedConditions[0].maxClaimableSupply).to.be.deep.equal("1.2");
    expect(updatedConditions[1].maxClaimableSupply).to.be.deep.equal("10.0");
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
    expect(updatedConditions[0].maxClaimableSupply).to.be.deep.equal("2.0");
    expect(updatedConditions[1].maxClaimableSupply).to.be.deep.equal("1.0");
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
});
