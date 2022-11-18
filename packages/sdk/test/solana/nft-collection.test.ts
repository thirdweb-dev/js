import { NFTCollection } from "../../src/solana";
import { sdk } from "./before-setup";
import { Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("NFTCollection", async () => {
  let collection: NFTCollection;
  let addr: string;

  before(async () => {
    addr = await sdk.deployer.createNftCollection({
      name: "Test Collection",
      description: "Test Description",
      symbol: "TC",
      creators: [
        {
          address: sdk.wallet.getAddress() || "",
          share: 100,
        },
      ],
    });
    collection = await sdk.getNFTCollection(addr);
  });

  it("should mint an NFT", async () => {
    const mint = await collection.mint({
      name: "Test NFT",
      description: "Test Description",
    });
    const nft = await collection.get(mint);
    expect(nft.metadata.name).to.eq("Test NFT");
    expect(nft.owner).to.eq(sdk.wallet.getAddress());
    expect(nft.supply).to.eq(1);
    expect(nft.metadata);
  });

  it("should fetch NFTs", async () => {
    const all = await collection.getAll();
    expect(all.length).to.eq(1);
    expect(all[0].metadata.name).to.eq("Test NFT");
  });

  it("should fetch balance of NFTs", async () => {
    const all = await collection.getAll();
    const balance = await collection.balanceOf(
      sdk.wallet.getAddress() || "",
      all[0].metadata.id,
    );
    expect(balance).to.eq(1);
  });

  it("Should update supply", async () => {
    const mint = await collection.mint({
      name: "Test NFT",
      description: "Test Description",
    });
    let nft = await collection.get(mint);
    expect(nft.supply).to.eq(1);
    await collection.mintAdditionalSupply(mint, 2);
    nft = await collection.get(mint);
    expect(nft.supply).to.eq(3);
  });

  it("should transfer NFTs", async () => {
    const all = await collection.getAll();
    const wallet = Keypair.generate();
    await collection.transfer(
      wallet.publicKey.toBase58() || "",
      all[0].metadata.id,
    );
    const balance = await collection.balanceOf(
      wallet.publicKey.toBase58() || "",
      all[0].metadata.id,
    );
    expect(balance).to.eq(1);
    const balance2 = await collection.balanceOf(
      sdk.wallet.getAddress() || "",
      all[0].metadata.id,
    );
    expect(balance2).to.eq(0);
  });

  it("should mint additional supply", async () => {
    const mint = await collection.mint({
      name: "Test NFT",
      description: "Test Description",
    });
    const [printed] = await collection.mintAdditionalSupply(mint, 1);
    let balance = await collection.balance(mint);
    expect(balance).to.equal(1);
    balance = await collection.balance(printed);
    expect(balance).to.equal(1);

    const [nft1, nft2] = await collection.mintAdditionalSupply(mint, 2);
    balance = await collection.balance(nft1);
    expect(balance).to.equal(1);
    balance = await collection.balance(nft2);
    expect(balance).to.equal(1);

    const supply = await collection.supplyOf(mint);
    expect(supply).to.equal(4);
  });

  it("test supply of", async () => {
    const mint = await collection.mint({
      name: "Test NFT",
      description: "Test Description",
    });

    const amount = 2;
    for (let i = 0; i < amount; i++) {
      await collection.mintAdditionalSupply(mint, 1);
    }

    const supply = await collection.supplyOf(mint);
    expect(supply).to.equal(amount + 1);
  });

  it("test burn supply", async () => {
    const mint = await collection.mint({
      name: "Test NFT",
      description: "Test Description",
    });

    let supply = await collection.supplyOf(mint);
    expect(supply).to.equal(1);

    await collection.burn(mint);
    supply = await collection.supplyOf(mint);
    expect(supply).to.equal(0);
  });

  it("should burn nfts", async () => {
    const mint = await collection.mint({
      name: "Test NFT to burn",
      description: "Test Description",
    });

    const all = await collection.getAll();
    await collection.burn(mint);
    const all2 = await collection.getAll();
    expect(all2.length).to.eq(all.length - 1);
  });

  it("should update creator settings", async () => {
    let creators = await collection.getCreators();
    expect(creators.length).to.equal(1);
    expect(creators[0].address).to.equal(sdk.wallet.getAddress());
    expect(creators[0].share).to.equal(100);

    const newCreator = Keypair.generate().publicKey.toBase58();
    await collection.updateCreators(
      [
        {
          address: sdk.wallet.getAddress() as string,
          share: 75,
        },
        { address: newCreator, share: 25 },
      ],
      true,
    );

    creators = await collection.getCreators();
    expect(creators.length).to.equal(2);
    expect(creators[0].address).to.equal(sdk.wallet.getAddress());
    expect(creators[0].share).to.equal(75);
    expect(creators[1].address).to.equal(newCreator);
    expect(creators[1].share).to.equal(25);

    const all = await collection.getAll();
    for (const nft of all) {
      // @ts-ignore
      const creatorsOfNft = await collection.nft.creatorsOf(nft.metadata.id);
      expect(creatorsOfNft.length).to.equal(2);
      expect(creatorsOfNft[0].address).to.equal(sdk.wallet.getAddress());
      expect(creatorsOfNft[0].share).to.equal(75);
      expect(creatorsOfNft[1].address).to.equal(newCreator);
      expect(creatorsOfNft[1].share).to.equal(25);
    }
  });

  it("Should update royalty", async () => {
    let royalty = await collection.getRoyalty();
    expect(royalty).to.equal(0);

    const mintAddress = (await collection.getAll())[0].metadata.id;
    // @ts-ignore
    let nft = await collection.nft.getRaw(mintAddress);
    expect(nft.isMutable).to.equal(true);
    expect(nft.sellerFeeBasisPoints).to.equal(0);

    await collection.updateRoyalty(100, true);

    royalty = await collection.getRoyalty();
    expect(royalty).to.equal(100);

    // @ts-ignore
    nft = await collection.nft.getRaw(mintAddress);
    expect(nft.sellerFeeBasisPoints).to.equal(100);
  });
});
