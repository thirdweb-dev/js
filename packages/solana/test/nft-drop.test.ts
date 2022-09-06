import { createTestSDK } from "./nft-collection.test";
import { ThirdwebSDK } from "../src/sdk";
import { NFTDrop } from "../src/contracts/nft-drop";
import { expect } from "chai";

describe("NFTDrop", async () => {
  let sdk: ThirdwebSDK;
  let drop: NFTDrop

  before(async () => {
    sdk = await createTestSDK();
    const addr = await sdk.deployer.createNftDrop({
      price: 1.25,
      sellerFeeBasisPoints: 500,
      itemsAvailable: 100,
    });
    drop = await sdk.getNFTDrop(addr);
  });

  it("should lazy mint an NFT", async () => {
    let items = (await drop.info).items;
    expect(items.length).to.equal(2)

    await drop.lazyMint([
      { name: "NFT #1", description: "This is the #1 NFT" },
      { name: "NFT #2", description: "This is the #2 NFT" },
    ])
   
    items = (await drop.info).items;
    expect(items.length).to.equal(2);
  })
})