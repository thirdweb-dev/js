import { NFTDrop } from "../src/contracts/nft-drop";
import { sdk } from "./before-setup";
import { sol } from "@metaplex-foundation/js";
import { expect } from "chai";

describe("NFTDrop", async () => {
  let drop: NFTDrop;

  before(async () => {
    const address = await sdk.deployer.createNftDrop({
      name: "Test Drop",
      price: 0,
      sellerFeeBasisPoints: 0,
      itemsAvailable: 5,
    });
    drop = await sdk.getNFTDrop(address);
  });

  it("should lazy mint NFTs", async () => {
    let supply = await drop.totalUnclaimedSupply();
    expect(supply).to.equal(0n);

    await drop.lazyMint([
      { name: "NFT #1", description: "This is the #1 NFT" },
      { name: "NFT #2", description: "This is the #2 NFT" },
      { name: "NFT #3", description: "This is the #3 NFT" },
      { name: "NFT #4", description: "This is the #4 NFT" },
      { name: "NFT #5", description: "This is the #5 NFT" },
    ]);

    supply = await drop.totalUnclaimedSupply();
    expect(supply).to.equal(5n);
  });

  it("should claim free drop", async () => {
    let unclaimed = await drop.totalUnclaimedSupply();
    let claimed = await drop.totalClaimedSupply();
    expect(unclaimed).to.equal(5n);
    expect(claimed).to.equal(0n);

    const address = await drop.claim();

    unclaimed = await drop.totalUnclaimedSupply();
    claimed = await drop.totalClaimedSupply();
    expect(unclaimed).to.equal(4n);
    expect(claimed).to.equal(1n);

    const balance = await drop.balance(address);
    expect(balance).to.equal(1n);
  });

  it("should get all nfts", async () => {
    await drop.claim();

    const all = await drop.getAll();
    const claimed = await drop.getAllClaimed();

    expect(all.length).to.equal(5);
    expect(claimed.length).to.equal(2);
  });

  it("should update claim condition", async () => {
    let condition = await drop.claimConditions.get();
    expect(condition.price).to.equal(0);

    await drop.claimConditions.set({
      price: 2,
    });

    condition = await drop.claimConditions.get();
    expect(condition.price).to.equal(sol(2).basisPoints.toNumber());
  });
});
