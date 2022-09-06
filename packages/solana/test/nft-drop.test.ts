import { sdk } from "./before-setup";
import { NFTDrop } from "../src/contracts/nft-drop";
import { expect } from "chai";

describe("NFTDrop", async () => {
  let drop: NFTDrop

  before(async () => {
    const address = await sdk.deployer.createNftDrop({
      price: 0,
      sellerFeeBasisPoints: 0,
      itemsAvailable: 2,
    });
    drop = await sdk.getNFTDrop(address);
  });

  it("should lazy mint NFTs", async () => {
    let supply = (await drop.getInfo()).itemsLoaded
    expect(supply.toNumber()).to.equal(0);

    await drop.lazyMint([
      { name: "NFT #1", description: "This is the #1 NFT" },
      { name: "NFT #2", description: "This is the #2 NFT" },
    ])
   
    supply = (await drop.getInfo()).itemsLoaded
    expect(supply.toNumber()).to.equal(2);
  })

  it("should claim free drop", async () => {
    let unclaimed = await drop.totalUnclaimedSupply();
    expect(unclaimed.toNumber()).to.equal(2)

    await drop.claim()

    unclaimed = await drop.totalUnclaimedSupply();
    expect(unclaimed.toNumber()).to.equal(1);
  });
})