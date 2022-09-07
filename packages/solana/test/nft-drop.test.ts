import { NFTDrop } from "../src/contracts/nft-drop";
import { sdk } from "./before-setup";
import { sol } from "@metaplex-foundation/js";
import { expect } from "chai";

describe("NFTDrop", async () => {
  let drop: NFTDrop;

  before(async () => {
    const address = await sdk.deployer.createNftDrop({
      price: 0,
      sellerFeeBasisPoints: 0,
      itemsAvailable: 5,
    });
    drop = await sdk.getNFTDrop(address);
  });

  it("should lazy mint NFTs", async () => {
    let supply = (await drop.getMetatada()).itemsLoaded;
    expect(supply.toNumber()).to.equal(0);

    await drop.lazyMint([
      { name: "NFT #1", description: "This is the #1 NFT" },
      { name: "NFT #2", description: "This is the #2 NFT" },
      { name: "NFT #3", description: "This is the #3 NFT" },
      { name: "NFT #4", description: "This is the #4 NFT" },
      { name: "NFT #5", description: "This is the #5 NFT" },
    ]);

    supply = (await drop.getMetatada()).itemsLoaded;
    expect(supply.toNumber()).to.equal(5);
  });

  it("should claim free drop", async () => {
    let unclaimed = await drop.totalUnclaimedSupply();
    expect(unclaimed.toNumber()).to.equal(5);

    await drop.claim();

    unclaimed = await drop.totalUnclaimedSupply();
    expect(unclaimed.toNumber()).to.equal(4);
  });

  it("should update settings", async () => {
    let price = (await drop.getMetatada()).price;
    expect(price.basisPoints.toNumber()).to.equal(0);
    await drop.setClaimConditions({
      price: 2,
    });

    price = (await drop.getMetatada()).price;
    expect(price.basisPoints.toNumber()).to.equal(
      sol(2).basisPoints.toNumber(),
    );
  });
});
