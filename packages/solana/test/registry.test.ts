import { sdk } from "./before-setup";
import { expect } from "chai";

describe("Registry", async () => {
  let nftColl;
  let nftDrop;
  let token;

  before(async () => {
    nftColl = await sdk.deployer.createNftCollection({
      name: "Test Collection",
      description: "Test Description",
      symbol: "TC",
    });
    token = await sdk.deployer.createToken({
      name: "Test Token",
      initialSupply: 100,
    });
    nftDrop = await sdk.deployer.createNftDrop({
      name: "Test Drop",
    });
  });

  it("should fetch accounts grouped by type", async () => {
    const t = await sdk.registry.getAccountsForWallet(
      sdk.wallet.getAddress() || "",
    );
    t.forEach((account) => {
      switch (account.type) {
        case "nft-collection":
          expect(account.name).to.equal("Test Collection");
          expect(account.address).to.equal(nftColl);
          break;
        case "nft-drop":
          expect(account.name).to.equal("Test Drop");
          expect(account.address).to.equal(nftDrop);
          break;
        case "token":
          expect(account.name).to.equal("Test Token");
          expect(account.address).to.equal(token);
          break;
      }
    });
  });

  it("should resolve account addresses", async () => {
    expect(await sdk.registry.getAccountType(nftColl)).to.eq("nft-collection");
    expect(await sdk.registry.getAccountType(nftDrop)).to.eq("nft-drop");
    expect(await sdk.registry.getAccountType(token)).to.eq("token");
  });
});
