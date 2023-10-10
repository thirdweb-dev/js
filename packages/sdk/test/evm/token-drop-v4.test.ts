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
import invariant from "tiny-invariant";

describe("Token Drop Contract (v4)", async () => {
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
      await sdk.deployer.getLatestBuiltInContractVersion(
        TokenDropInitializer.contractType,
      ),
    );
    dropContract = await sdk.getContract(address, "token-drop");
  });

  it("should allow a snapshot to be set", async () => {
    await dropContract.claimConditions.set([
      {
        startTime: new Date(Date.now() / 2),
        maxClaimablePerWallet: 1,
        snapshot: [bobWallet.address, samWallet.address, abbyWallet.address],
        price: 1,
      },
      {
        startTime: new Date(),
        maxClaimablePerWallet: 1,
        snapshot: [bobWallet.address],
      },
    ]);

    const metadata = await dropContract.metadata.get();
    const merkles = metadata.merkle;

    expect(merkles).have.property(
      "0xb2acf11f3694bfc1e9db18a7cd01083bc48db49bd1ae524a90f102914f3f7c2a",
    );
    expect(merkles).have.property(
      "0xeed6db05cfdf0ef8cf5b98791d1e7d436862f346af8b0a7c8a5eb864dbb1c6fb",
    );

    const roots = (await dropContract.claimConditions.getAll()).map(
      (c) => c.merkleRootHash,
    );
    expect(roots).length(2);
  });

  it("should return snapshot data on claim conditions", async () => {
    await dropContract.claimConditions.set([
      {
        maxClaimablePerWallet: 1,
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
        maxClaimablePerWallet: 1,
        snapshot: [bobWallet.address, samWallet.address, abbyWallet.address],
      },
      {
        startTime: new Date(Date.now() + 60 * 60 * 1000),
        maxClaimablePerWallet: 1,
        snapshot: [bobWallet.address],
      },
    ]);

    const metadata = await dropContract.metadata.get();
    const merkles = metadata.merkle;

    expect(merkles).have.property(
      "0xb2acf11f3694bfc1e9db18a7cd01083bc48db49bd1ae524a90f102914f3f7c2a",
    );
    expect(merkles).have.property(
      "0xeed6db05cfdf0ef8cf5b98791d1e7d436862f346af8b0a7c8a5eb864dbb1c6fb",
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
        maxClaimablePerWallet: 2.1,
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
        maxClaimablePerWallet: 1,
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
          maxClaimablePerWallet: 0,
          snapshot: [
            bobWallet.address,
            samWallet.address,
            abbyWallet.address,
          ].map((a) => ({ address: a, maxClaimable: 1 })),
        },
      ],
      false,
    );
    await sdk.updateSignerOrProvider(w1);
    try {
      await dropContract.claim(1);
    } catch (err: any) {
      expectError(err, "!Qty");
    }
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
        maxClaimablePerWallet: 0,
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
      expectError(e, "!Qty");
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

    it("should transform qunatities back to readable values", async () => {
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
          maxClaimablePerWallet: 1,
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
        maxClaimablePerWallet: 0,
        snapshot: [{ address: w1.address, maxClaimable: 1 }],
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
        maxClaimablePerWallet: 0,
        snapshot: [{ address: w1.address, maxClaimable: 1 }],
      },
    ]);

    const reasons =
      await dropContract.claimConditions.getClaimIneligibilityReasons(
        "1",
        w2.address,
      );
    expect(reasons).to.contain(ClaimEligibility.AddressNotAllowed);

    await dropContract.claimConditions.update(0, {
      maxClaimablePerWallet: 0,
      snapshot: [
        { address: w1.address, maxClaimable: 1 },
        { address: w2.address, maxClaimable: 1 },
      ],
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
    await dropContract.claimConditions.set([
      {
        maxClaimablePerWallet: 0,
        snapshot: [{ address: w1.address, maxClaimable: 1 }],
      },
    ]);

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
      {
        address: w1.address.toUpperCase().replace("0X", "0x"),
        maxClaimable: 1,
      },
      { address: w2.address.toLowerCase(), maxClaimable: 1 },
      { address: w3.address.toLowerCase(), maxClaimable: 1 },
    ];
    await dropContract.claimConditions.set([
      {
        maxClaimablePerWallet: 0,
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
      { startTime: new Date(), maxClaimablePerWallet: 60 },
    ]);
    const oldConditions = await dropContract.claimConditions.getAll();
    expect(oldConditions.length).to.be.equal(2);
    await dropContract.claimConditions.update(0, { maxClaimablePerWallet: 10 });
    let updatedConditions = await dropContract.claimConditions.getAll();
    expect(updatedConditions[0].maxClaimableSupply).to.be.deep.equal("1.2");
    expect(updatedConditions[0].maxClaimablePerWallet).to.be.deep.equal("10.0");
    expect(updatedConditions[1].maxClaimablePerWallet).to.be.deep.equal("60.0");

    await dropContract.claimConditions.update(1, {
      maxClaimableSupply: 10,
      maxClaimablePerWallet: 10,
    });
    updatedConditions = await dropContract.claimConditions.getAll();
    expect(updatedConditions[0].maxClaimableSupply).to.be.deep.equal("1.2");
    expect(updatedConditions[1].maxClaimableSupply).to.be.deep.equal("10.0");
    expect(updatedConditions[1].maxClaimablePerWallet).to.be.deep.equal("10.0");
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
