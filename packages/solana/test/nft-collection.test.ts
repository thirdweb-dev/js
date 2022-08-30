import { MockStorage } from "../../sdk/test/mock/MockStorage";
import { NFTCollection } from "../src/contracts/nft-collection";
import { ThirdwebSDK } from "../src/sdk";
import { createThirdwebSDK } from "../src/server";
import { expect } from "chai";

describe("NFTCollection", async () => {
  let sdk: ThirdwebSDK;
  let collection: NFTCollection;

  before(async () => {
    sdk = createThirdwebSDK("localhost", new MockStorage());
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
      uri: "https://test.com",
    });
    expect(mint.name).to.eq("Test NFT");
  });

  it("should fetch NFTs", async () => {
    const all = await collection.getAll();
    expect(all.length).to.eq(1);
    const single = await collection.get(all[0]);
    expect(single.name).to.eq("Test NFT");
  });
});
