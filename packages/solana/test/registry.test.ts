import { sdk } from "./before-setup";

describe("Registry", async () => {
  before(async () => {
    const addr = await sdk.deployer.createNftCollection({
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

  it("test regsitry", async () => {
    const t = await sdk.registry.getAllMetadataAccontsForWallet(
      sdk.wallet.getAddress() || "",
    );
    console.log(t);

    const colls = t.nftCollections[0];
    const nftCollection = await sdk.getNFTCollection(colls);
    console.log(await nftCollection.getMetadata());

    const token = await sdk.getToken(t.tokens[0]);
    console.log(await token.getMetadata());
  });
});
