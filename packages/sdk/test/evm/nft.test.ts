import { NFTMetadataInput } from "../../src/core/schema/nft";
import { NFTCollection, NFTCollectionInitializer } from "../../src/evm";
import { sdk, signers, storage } from "./before-setup";
import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";

global.fetch = require("cross-fetch");

describe("NFT Contract", async () => {
  type NewType = NFTCollection;
  let nftContract: NewType;
  let adminWallet: SignerWithAddress, samWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const address = await sdk.deployer.deployBuiltInContract(
      NFTCollectionInitializer.contractType,
      {
        name: "NFT Contract",
        description: "Test NFT contract from tests",
        image:
          "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
        primary_sale_recipient: adminWallet.address,
        seller_fee_basis_points: 1000,
        fee_recipient: AddressZero,
        platform_fee_basis_points: 10,
        platform_fee_recipient: AddressZero,
      },
    );
    nftContract = await sdk.getNFTCollection(address);
  });

  it("should return nfts even if some are burned", async () => {
    await nftContract.mint({
      name: "Test1",
    });
    const token = await nftContract.mint({
      name: "Test2",
    });
    await nftContract.burn(token.id);
    const nfts = await nftContract.getAll();
    expect(nfts).to.be.an("array").length(2);
  });

  it("should let authorized minters mint with detected features", async () => {
    await nftContract.roles.grant("minter", samWallet.address);
    sdk.updateSignerOrProvider(samWallet);
    await nftContract.mintTo(samWallet.address, {
      name: "Test1",
    });
  });

  it("should return owned token ids", async () => {
    await nftContract.mint({
      name: "Test1",
    });
    await nftContract.mint({
      name: "Test2",
    });
    const ids = await nftContract.getOwnedTokenIds();
    const nfts = await nftContract.getOwned();
    expect(ids).to.be.an("array").length(2);
    expect(nfts).to.be.an("array").length(2);
  });

  it("should respect pagination", async () => {
    const nfts = [] as NFTMetadataInput[];
    for (let i = 0; i < 100; i++) {
      nfts.push({
        name: `Test${i}`,
      });
    }
    await nftContract.mintBatch(nfts);
    const total = await nftContract.totalSupply();
    expect(total.toNumber()).to.eq(100);
    const page1 = await nftContract.getAll({
      count: 2,
      start: 0,
    });
    expect(page1).to.be.an("array").length(2);
    const page2 = await nftContract.getAll({
      count: 2,
      start: 20,
    });
    expect(page2).to.be.an("array").length(2);
    expect(page2[0].metadata.name).to.eq("Test20");
    expect(page2[1].metadata.name).to.eq("Test21");
  });

  it("should fetch a single nft", async () => {
    await nftContract.mint({
      name: "Test1",
    });
    const nft = await nftContract.get("0");
    assert.isNotNull(nft);
    assert.equal(nft.metadata.name, "Test1");
  });

  it("should mint with URI", async () => {
    const uri = await storage.upload({
      name: "Test1",
    });
    await nftContract.mint(uri);
    const nft = await nftContract.get("0");
    assert.isNotNull(nft);
    assert.equal(nft.metadata.name, "Test1");
  });

  it("should mint batch with URI", async () => {
    const uri = await storage.upload({
      name: "Test1",
    });
    await nftContract.mintBatch([uri]);
    const nft = await nftContract.get("0");
    assert.isNotNull(nft);
    assert.equal(nft.metadata.name, "Test1");
  });

  it("should return an owner as zero address for an nft that is burned", async () => {
    const token = await nftContract.mint({
      name: "Test2",
    });
    await nftContract.burn(token.id);
    const nft = await nftContract.get("0");
    assert.equal(nft.owner, AddressZero);
  });

  it("should correctly mint nfts in batch", async () => {
    const metas = [
      {
        name: "Test1",
      },
      {
        name: "Test2",
      },
    ];
    const batch = await nftContract.mintBatch(metas);
    assert.lengthOf(batch, 2);

    for (const meta of metas) {
      const nft = batch.find(
        async (n) => (await n.data()).metadata.name === meta.name,
      );
      assert.isDefined(nft);
    }
  });

  it("should not be able to mint without permission", async () => {
    sdk.updateSignerOrProvider(samWallet);
    await expect(
      nftContract.mint({
        name: "Test2",
      }),
    ).to.throw;
  });

  it("should mint complex metadata", async () => {
    const tx = await nftContract.mint({
      name: "Test2",
      description: "description",
      image: "https://img.net",
      animation_url: "https://img.net",
      background_color: "#000000",
      external_url: "https://img.net",
      properties: {
        arr: ["1", "2", "3"],
        obj: {
          anum: 12,
          astr: "123",
        },
        val: "1234",
      },
      attributes: {
        arr: ["1", "2", "3"],
        obj: {
          anum: 12,
          astr: "123",
        },
        val: "1234",
      },
      arr: ["1", "2", "3"],
      obj: {
        anum: 12,
        astr: "123",
      },
      val: "1234",
    });
    expect(tx.id.toNumber()).to.eq(0);
  });

  it("should mint complex metadata 2", async () => {
    const tx = await nftContract.mint({
      name: "Test2",
      description: "description",
      image: "https://img.net",
      animation_url: "https://img.net",
      background_color: "#000000",
      external_url: "https://img.net",
      properties: [
        { key: "color", value: "silver" },
        { key: "size", value: "small" },
        { key: "tier", value: 3 },
      ],
      attributes: [
        { key: "color", value: "silver" },
        { key: "size", value: "small" },
        { key: "tier", value: 3 },
      ],
    });
    expect(tx.id.toNumber()).to.eq(0);
  });

  it("should mint simple metadata 2", async () => {
    const tx = await nftContract.mint({
      name: "Test2",
      description: "description",
      image: "https://img.net",
    });
    expect(tx.id.toNumber()).to.eq(0);
  });

  it("should mint complex metadata 3", async () => {
    const tx = await nftContract.mint({
      name: "Test2",
      description: "description",
      image: "https://img.net",
      animation_url: "https://img.net",
      background_color: "#000000",
      external_url: "https://img.net",
      properties: {
        name: "Purple Cookie",
        description: "A delicious cookie",
        attributes: [
          { trait_type: "color", value: "purple" },
          { trait_type: "size", value: "small" },
          { trait_type: "tier", value: 1 },
          {
            display_type: "boost_percentage",
            trait_type: "Stamina Increase",
            value: 90,
          },
          {
            display_type: "number",
            trait_type: "Generation",
            value: 1,
          },
        ],
      },
      attributes: {
        name: "Purple Cookie",
        description: "A delicious cookie",
        attributes: [
          { trait_type: "color", value: "purple" },
          { trait_type: "size", value: "small" },
          { trait_type: "tier", value: 1 },
          {
            display_type: "boost_percentage",
            trait_type: "Stamina Increase",
            value: 90,
          },
          {
            display_type: "number",
            trait_type: "Generation",
            value: 1,
          },
        ],
      },
    });
    expect(tx.id.toNumber()).to.eq(0);
  });

  it("allOwners() should not return AddressZero as one of the owners", async () => {
    const metadata = [{ name: "Test1" }, { name: "Test2" }, { name: "Test3" }];
    await nftContract.mintBatch(metadata);

    // Send one to AddressZero so that we can run the test
    await nftContract.burn(0);
    const records = await nftContract.erc721.getAllOwners();
    const hasFaultyRecord = records.some((item) => item.owner === AddressZero);
    assert.strictEqual(hasFaultyRecord, false);
    expect(records).to.be.an("array").length(2);
    expect(records[0].tokenId).to.eq(1);
    expect(records[1].tokenId).to.eq(2);
  });

  it("should respect pagination for getOwned (erc-721-standard.ts)", async () => {
    const _tokenIds: number[] = Array.from({ length: 11 }, (_, index) => index); // [0, 1, ... 10]
    const metadata = _tokenIds.map((num) => ({ name: `Test${num}` }));
    await nftContract.mintBatch(metadata);
    const nftPage1 = await nftContract.getOwned(undefined, {
      count: 2,
      start: 0,
    });
    expect(nftPage1).to.be.an("array").length(2);
    expect(nftPage1[0].metadata.id).to.eq("0");
    expect(nftPage1[1].metadata.id).to.eq("1");

    const nftPage2 = await nftContract.getOwned(undefined, {
      count: 3,
      start: 2,
    });
    expect(nftPage2).to.be.an("array").length(3);
    expect(nftPage2[0].metadata.id).to.eq("2");
    expect(nftPage2[1].metadata.id).to.eq("3");
    expect(nftPage2[2].metadata.id).to.eq("4");
  });

  it("should respect pagination for getOwned (erc-721.ts)", async () => {
    const _tokenIds: number[] = Array.from({ length: 11 }, (_, index) => index); // [0, 1, ... 10]
    const metadata = _tokenIds.map((num) => ({ name: `Test${num}` }));
    await nftContract.mintBatch(metadata);
    const nftPage1 = await nftContract.erc721.getOwned(undefined, {
      count: 2,
      start: 0,
    });
    expect(nftPage1).to.be.an("array").length(2);
    expect(nftPage1[0].metadata.id).to.eq("0");
    expect(nftPage1[1].metadata.id).to.eq("1");

    const nftPage2 = await nftContract.erc721.getOwned(undefined, {
      count: 3,
      start: 2,
    });
    expect(nftPage2).to.be.an("array").length(3);
    expect(nftPage2[0].metadata.id).to.eq("2");
    expect(nftPage2[1].metadata.id).to.eq("3");
    expect(nftPage2[2].metadata.id).to.eq("4");
  });

  it("getOwned should return all item when queryParams.count is greater than the total supply (erc-721-standard.ts)", async () => {
    const _tokenIds: number[] = Array.from({ length: 11 }, (_, index) => index); // [0, 1, ... 10]
    const metadata = _tokenIds.map((num) => ({ name: `Test${num}` }));
    await nftContract.mintBatch(metadata);
    const nfts = await nftContract.getOwned(undefined, {
      count: 1000,
      start: 0,
    });
    expect(nfts).to.be.an("array").length(_tokenIds.length);
  });

  it("getOwned should return all items when queryParams.count is greater than the total supply (erc-721.ts)", async () => {
    const _tokenIds: number[] = Array.from({ length: 11 }, (_, index) => index); // [0, 1, ... 10]
    const metadata = _tokenIds.map((num) => ({ name: `Test${num}` }));
    await nftContract.mintBatch(metadata);
    const nfts = await nftContract.erc721.getOwned(undefined, {
      count: 1000,
      start: 0,
    });
    expect(nfts).to.be.an("array").length(_tokenIds.length);
  });
});
