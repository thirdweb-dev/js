import { sdk } from "./before-setup";
import { expect } from "chai";

describe("Registry", async () => {
  before(async () => {
    await sdk.deployer.createNftCollection({
      name: "Test Collection",
      description: "Test Description",
      symbol: "TC",
    });
    await sdk.deployer.createToken({
      name: "Test Token",
      initialSupply: 100,
    });
    await sdk.deployer.createNftDrop({
      name: "Test Drop",
    });
  });

  it("should fetch accounts grouped by type", async () => {
    const t = await sdk.registry.getAccountsForWallet(
      sdk.wallet.getAddress() || "",
    );
    const colls = t.nftCollections[0];
    const nftCollection = await sdk.getNFTCollection(colls);
    expect((await nftCollection.getMetadata()).name).to.eq("Test Collection");

    const token = await sdk.getToken(t.tokens[0]);
    expect((await token.getMetadata()).name).to.eq("Test Token");

    const drop = await sdk.getNFTDrop(t.drops[0]);
    expect((await drop.getMetadata()).name).to.eq("Test Drop");
  });
});
