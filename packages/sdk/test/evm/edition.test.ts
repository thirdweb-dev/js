import { Edition } from "../../src/evm";
import { expectError, sdk, signers, storage } from "./before-setup";
import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { ethers } from "ethers";

global.fetch = require("cross-fetch");

describe("Edition Contract", async () => {
  let bundleContract: Edition;
  // let nftContract: NFTContract;
  // let currencyContract: CurrencyContract;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const address = await sdk.deployer.deployEdition({
      name: `Testing bundle from SDK`,
      description: "Test contract from tests",
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
      primary_sale_recipient: adminWallet.address,
      seller_fee_basis_points: 1000,
      fee_recipient: AddressZero,
      platform_fee_basis_points: 10,
      platform_fee_recipient: AddressZero,
    });
    bundleContract = await sdk.getEdition(address);
  });

  it("gas cost", async () => {
    const cost = await bundleContract.estimator.gasCostOf("mintTo", [
      adminWallet.address,
      ethers.constants.MaxUint256,
      "mock://12398172398172389/0",
      1,
    ]);
    expect(parseFloat(cost)).gt(0);
  });

  it("gas limit", async () => {
    const limit = await bundleContract.estimator.gasLimitOf("mintTo", [
      adminWallet.address,
      ethers.constants.MaxUint256,
      "mock://12398172398172389/0",
      1,
    ]);
    expect(limit.toNumber()).gt(0);
  });

  it("should respect pagination", async () => {
    const nfts = [] as { metadata: { name: string }; supply: number }[];
    for (let i = 0; i < 100; i++) {
      nfts.push({
        metadata: { name: `Test${i}` },
        supply: 10,
      });
    }
    await bundleContract.mintBatch(nfts);
    const total = await bundleContract.getTotalCount();
    expect(total.toNumber()).to.eq(100);
    const page1 = await bundleContract.getAll({
      count: 2,
      start: 0,
    });
    expect(page1).to.be.an("array").length(2);
    const page2 = await bundleContract.getAll({
      count: 2,
      start: 20,
    });
    expect(page2).to.be.an("array").length(2);
    expect(page2[0].metadata.name).to.eq("Test20");
    expect(page2[1].metadata.name).to.eq("Test21");
  });

  it("mint additional suply", async () => {
    const tx = await bundleContract.mint({
      metadata: {
        name: "Bundle 1",
        description: "Bundle 1",
        image: "fake://myownfakeipfs",
      },
      supply: 10,
    });
    const nft = await bundleContract.get(tx.id);
    expect(nft.supply).to.eq("10");
    await bundleContract.mintAdditionalSupply(tx.id, 10);
    const nft2 = await bundleContract.get(tx.id);
    expect(nft2.supply).to.eq("20");
  });

  it("should mint with URI", async () => {
    const uri = await storage.upload({
      name: "Test1",
    });
    const tx = await bundleContract.mint({
      metadata: uri,
      supply: 10,
    });
    const nft = await bundleContract.get(tx.id);
    assert.isNotNull(nft);
    assert.equal(nft.metadata.name, "Test1");
  });

  it("should mint batch with URI", async () => {
    const uri = await storage.upload({
      name: "Test1",
    });
    await bundleContract.mintBatch([
      {
        metadata: uri,
        supply: 10,
      },
    ]);
    const nft = await bundleContract.get("0");
    assert.isNotNull(nft);
    assert.equal(nft.metadata.name, "Test1");
  });

  it("should return all owned collection tokens", async () => {
    await bundleContract.mint({
      metadata: {
        name: "Bundle 1",
        description: "Bundle 1",
        image: "fake://myownfakeipfs",
      },
      supply: 100,
    });
    const nfts = await bundleContract.getOwned(adminWallet.address);
    expect(nfts).to.be.an("array").length(1);
    expect(nfts[0].metadata.image).to.be.equal("fake://myownfakeipfs");
    expect(nfts[0].owner).to.be.equal(adminWallet.address);
    expect(nfts[0].quantityOwned).to.be.equal("100");
    expect(nfts[0].supply).to.be.equal("100");

    const bobsNfts = await bundleContract.getOwned(bobWallet.address);
    expect(bobsNfts)
      .to.be.an("array")
      .length(0, "Bob should not have any nfts");

    await bundleContract.transfer(bobWallet.address, 0, 20);
    const adminNft = await bundleContract.getOwned(adminWallet.address);
    expect(adminNft[0].quantityOwned).to.be.equal("80");
    const bobsNftsAfterTransfer = await bundleContract.getOwned(
      bobWallet.address,
    );
    expect(bobsNftsAfterTransfer[0].quantityOwned).to.be.equal("20");
  });

  it("should airdrop edition tokens to different wallets", async () => {
    await bundleContract.mint({
      metadata: {
        name: "Bundle 1",
        description: "Bundle 1",
        image: "fake://myownfakeipfs",
      },
      supply: 8,
    });
    const addresses = [
      {
        address: samWallet.address,
        quantity: 5,
      },
      {
        address: bobWallet.address,
        quantity: 3,
      },
    ];

    await bundleContract.airdrop(0, addresses);

    const samOwned = await bundleContract.getOwned(samWallet.address);
    const bobOwned = await bundleContract.getOwned(bobWallet.address);
    expect(samOwned[0].quantityOwned).to.be.equal("5");
    expect(bobOwned[0].quantityOwned).to.be.equal("3");
  });

  it("should fail airdrop because not enough NFTs owned", async () => {
    await bundleContract.mint({
      metadata: {
        name: "Bundle 1",
        description: "Bundle 1",
        image: "fake://myownfakeipfs",
      },
      supply: 8,
    });
    const addresses = [
      {
        address: samWallet.address,
        quantity: 5,
      },
      {
        address: bobWallet.address,
        quantity: 12,
      },
    ];

    try {
      await bundleContract.airdrop(0, addresses);
    } catch (e) {
      expectError(e, "The caller owns");
    }
  });

  // TODO: This test should move to the royalty suite
  it("updates the bps in both the metadata and on-chain", async () => {
    const currentBps = (await bundleContract.royalties.getDefaultRoyaltyInfo())
      .seller_fee_basis_points;
    assert.equal(currentBps, 1000);
    const cMetadata = await bundleContract.metadata.get();
    assert.equal(cMetadata.seller_fee_basis_points, 1000);

    const testBPS = 100;
    await bundleContract.royalties.setDefaultRoyaltyInfo({
      seller_fee_basis_points: testBPS,
    });
    const newMetadata = await bundleContract.metadata.get();

    assert.equal(
      newMetadata.seller_fee_basis_points,
      testBPS,
      "Fetching the BPS from the metadata should return 100",
    );
    assert.equal(
      (await bundleContract.royalties.getDefaultRoyaltyInfo())
        .seller_fee_basis_points,
      testBPS,
      "Fetching the BPS with the tx should return 100",
    );
  });
  it("should correctly upload nft metadata", async () => {
    await bundleContract.mintBatch([
      {
        metadata: {
          name: "Test0",
        },
        supply: 5,
      },
      {
        metadata: {
          name: "Test1",
        },
        supply: 5,
      },
    ]);
    const nfts = await bundleContract.getAll();
    expect(nfts).to.be.an("array").length(2);
    let i = 0;
    nfts.forEach((nft) => {
      expect(nft.metadata.name).to.be.equal(`Test${i}`);
      i++;
    });
  });

  it("should respect pagination for getOwned", async () => {
    const nfts = [] as { metadata: { name: string }; supply: number }[];
    for (let i = 0; i < 10; i++) {
      nfts.push({
        metadata: { name: `Test${i}` },
        supply: 10,
      });
    }
    await bundleContract.mintBatch(nfts);
    const total = await bundleContract.getTotalCount();
    expect(total.toNumber()).to.eq(10);
    const page1 = await bundleContract.getOwned(adminWallet.address, {
      count: 2,
      start: 0,
    });
    expect(page1).to.be.an("array").length(2);
    const page3 = await bundleContract.getOwned(adminWallet.address, {
      count: 3,
      start: 2,
    });
    expect(page3).to.be.an("array").length(3);
    expect(page3[0].metadata.id).to.eq("6");
    expect(page3[1].metadata.id).to.eq("7");
  });

  it("getOwned pagination should return all records when queryParams.count is greater than the total supply", async () => {
    const nfts = [] as { metadata: { name: string }; supply: number }[];
    for (let i = 0; i < 10; i++) {
      nfts.push({
        metadata: { name: `Test${i}` },
        supply: 10,
      });
    }
    await bundleContract.mintBatch(nfts);
    const items = await bundleContract.getOwned(undefined, {
      count: 1000,
      start: 0,
    });
    expect(items).to.be.an("array").length(nfts.length);
  });
});
