import { NFTCollection } from "../../src/solana";
import { sdk } from "./before-setup";
import { expect } from "chai";

describe("NFTCollection get all", async () => {
  let collection: NFTCollection;
  let addr: string;

  const AMOUNT = 5;

  before(async () => {
    addr = await sdk.deployer.createNftCollection({
      name: "Test Collection",
      description: "Test Description",
      symbol: "TC",
    });
    collection = await sdk.getNFTCollection(addr);
  });

  it("mint NFTs", async () => {
    for (let i = 0; i < AMOUNT; i++) {
      await collection.mint({
        name: `Test NFT ${i}`,
        description: `Test Description ${i}`,
      });
    }
  });

  it("fetch all NFTs", async () => {
    let all = await collection.getAll({
      start: 0,
      count: 2,
    });
    expect(all.length).to.eq(2);
    expect(all[0].metadata.name).to.eq("Test NFT 0");
    expect(all[1].metadata.name).to.eq("Test NFT 1");
    all = await collection.getAll({
      start: 2,
      count: 3,
    });
    expect(all.length).to.eq(3);
    expect(all[0].metadata.name).to.eq("Test NFT 2");
    expect(all[1].metadata.name).to.eq("Test NFT 3");
    expect(all[2].metadata.name).to.eq("Test NFT 4");
  });
});
