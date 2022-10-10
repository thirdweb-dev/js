import { NFTCollection } from "../../src/solana";
import { sdk } from "./before-setup";
import { expect } from "chai";

describe("NFTCollection", async () => {
  let collection: NFTCollection;
  let addr: string;

  const AMOUNT = 100;

  before(async () => {
    addr = await sdk.deployer.createNftCollection({
      name: "Test Collection",
      description: "Test Description",
      symbol: "TC",
    });
    collection = await sdk.getNFTCollection(addr);
  });

  it("mint NFTs", async () => {
    await Promise.all(
      [...Array(AMOUNT)].map((_, i) => {
        return collection.mint({
          name: `Test NFT ${i}`,
          description: "Test Description",
        });
      }),
    );
  });

  it("fetch all NFTs", async () => {
    const all = await collection.getAll({
      start: 0,
      count: 5,
    });
    console.log(all.map((a) => a.metadata.name));
    expect(all.length).to.eq(AMOUNT);
    //expect(all[0].metadata.name).to.eq("Test NFT 0");
  });
});
