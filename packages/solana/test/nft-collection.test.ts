import { NFTCollection } from "../src/contracts/nft-collection";
import { sdk } from "./before-setup";
import { Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("NFTCollection", async () => {
  let collection: NFTCollection;

  before(async () => {
    const addr = await sdk.deployer.createNftCollection({
      name: "Test Collection",
      description: "Test Description",
      symbol: "TC",
    });
    collection = await sdk.getNFTCollection(addr);
  });

  it("should mint an NFT", async () => {
    const mint = await collection.mint({
      name: "Test NFT",
      description: "Test Description",
    });
    const nft = await collection.get(mint);
    expect(nft.name).to.eq("Test NFT");
  });

  it("should fetch NFTs", async () => {
    const all = await collection.getAll();
    expect(all.length).to.eq(1);
    const single = await collection.get(all[0]);
    expect(single.name).to.eq("Test NFT");
  });

  it("should fetch balance of NFTs", async () => {
    const all = await collection.getAll();
    const balance = await collection.balanceOf(
      sdk.wallet.getAddress() || "",
      all[0],
    );
    expect(balance).to.eq(1n);
  });

  it("should transfer NFTs", async () => {
    const all = await collection.getAll();
    const wallet = Keypair.generate();
    await collection.transfer(wallet.publicKey.toBase58() || "", all[0]);
    const balance = await collection.balanceOf(
      wallet.publicKey.toBase58() || "",
      all[0],
    );
    expect(balance).to.eq(1n);
    const balance2 = await collection.balanceOf(
      sdk.wallet.getAddress() || "",
      all[0],
    );
    expect(balance2).to.eq(0n);
  });

  it("should mint additional supply", async () => {
    const mint = await collection.mint({
      name: "Test NFT",
      description: "Test Description",
    });
    const printed = await collection.mintAdditionalSupply(mint);
    let balance = await collection.balance(mint);
    expect(balance).to.equal(1n);
    balance = await collection.balance(printed);
    expect(balance).to.equal(1n);
  });
});
