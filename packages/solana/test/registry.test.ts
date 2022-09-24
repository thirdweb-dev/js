import { ThirdwebSDK } from "../src/index";
import { createThirdwebSDK } from "../src/server/index";
import { createTestSDK } from "./before-setup";
import { expect } from "chai";

describe("Registry", async () => {
  let nftColl: string;
  let nftDrop: string;
  let token: string;
  let freshSDK: ThirdwebSDK;

  before(async () => {
    freshSDK = await createTestSDK();
    nftColl = await freshSDK.deployer.createNftCollection({
      name: "Reg Test Collection",
      description: "Test Description",
      symbol: "TC",
    });
    token = await freshSDK.deployer.createToken({
      name: "Reg Test Token",
      initialSupply: 100,
    });
    nftDrop = await freshSDK.deployer.createNftDrop({
      name: "Reg Test Drop",
      itemsAvailable: 10,
    });
  });

  it("should fetch accounts grouped by type", async () => {
    const t = await freshSDK.registry.getAccountsForWallet(
      freshSDK.wallet.getAddress() || "",
    );
    expect(t.length).to.eq(3);
    t.forEach((account) => {
      switch (account.type) {
        case "nft-collection":
          expect(account.name).to.equal("Reg Test Collection");
          expect(account.address).to.equal(nftColl);
          break;
        case "nft-drop":
          expect(account.name).to.equal("Reg Test Drop");
          expect(account.address).to.equal(nftDrop);
          break;
        case "token":
          expect(account.name).to.equal("Reg Test Token");
          expect(account.address).to.equal(token);
          break;
      }
    });
  });

  it("should resolve account addresses", async () => {
    expect(await freshSDK.registry.getAccountType(nftColl)).to.eq(
      "nft-collection",
    );
    expect(await freshSDK.registry.getAccountType(nftDrop)).to.eq("nft-drop");
    expect(await freshSDK.registry.getAccountType(token)).to.eq("token");
  });
});
