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
    t.forEach((account) => {
      switch (account.type) {
        case "nft-collection":
          expect(account.name).to.equal("Test Collection");
          break;
        case "nft-drop":
          expect(account.name).to.equal("Test Drop");
          break;
        case "token":
          expect(account.name).to.equal("Test Token");
          break;
      }
    });
  });
});
