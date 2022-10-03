import { NFTDrop } from "../../src/solana";
import { sdk } from "./before-setup";
import { expect } from "chai";

describe("NFTDrop", async () => {
  let drop: NFTDrop;

  before(async () => {
    const address = await sdk.deployer.createNftDrop({
      name: "NFT Drop #1",
      itemsAvailable: 5,
    });
    drop = await sdk.getNFTDrop(address);
  });

  it("should lazy mint NFTs", async () => {
    let supply = await drop.totalUnclaimedSupply();
    expect(supply).to.equal(0);

    await drop.lazyMint([
      { name: "NFT #1", description: "This is the #1 NFT" },
      { name: "NFT #2", description: "This is the #2 NFT" },
      { name: "NFT #3", description: "This is the #3 NFT" },
      { name: "NFT #4", description: "This is the #4 NFT" },
      { name: "NFT #5", description: "This is the #5 NFT" },
    ]);

    supply = await drop.totalUnclaimedSupply();
    expect(supply).to.equal(5);
  });

  it("should claim free drop", async () => {
    let unclaimed = await drop.totalUnclaimedSupply();
    let claimed = await drop.totalClaimedSupply();
    expect(unclaimed).to.equal(5);
    expect(claimed).to.equal(0);

    const address = await drop.claim(1);

    unclaimed = await drop.totalUnclaimedSupply();
    claimed = await drop.totalClaimedSupply();
    expect(unclaimed).to.equal(4);
    expect(claimed).to.equal(1);

    const balance = await drop.balance(address[0]);
    expect(balance).to.equal(1);
  });

  it("should get all nfts", async () => {
    await drop.claim(2);

    const all = await drop.getAll();
    const claimed = await drop.getAllClaimed();

    expect(all.length).to.equal(5);
    expect(claimed.length).to.equal(3);
  });

  it("should update claim condition", async () => {
    let condition = await drop.claimConditions.get();
    expect(condition.price.displayValue).to.equal("0.000000000");

    await drop.claimConditions.set({
      price: 2,
    });

    condition = await drop.claimConditions.get();
    expect(condition.price.displayValue).to.equal("2.000000000");
  });

  it.skip("should burn nfts", async () => {
    const address = await sdk.deployer.createNftDrop({
      name: "NFT Drop #2",
      itemsAvailable: 5,
    });
    const burnDrop = await sdk.getNFTDrop(address);
    await burnDrop.lazyMint([
      { name: "NFT #1", description: "This is the #1 NFT" },
      { name: "NFT #2", description: "This is the #2 NFT" },
      { name: "NFT #3", description: "This is the #3 NFT" },
      { name: "NFT #4", description: "This is the #4 NFT" },
      { name: "NFT #5", description: "This is the #5 NFT" },
    ]);
    await burnDrop.claim(5);

    // TODO @joaquim - getAllClaimed does *not* return a supply field at all (so it ends up being 0)
    const all = await burnDrop.getAllClaimed();

    expect(all.length).to.eq(5);

    expect(all[0].supply).to.eq(1);

    await burnDrop.burn(all[0].metadata.id);
    const all2 = await burnDrop.getAllClaimed();

    // will not reduce length
    expect(all2.length).to.eq(5);
    // should reduce supply to 0
    expect(all2[0].supply).to.eq(0);
  });
});
