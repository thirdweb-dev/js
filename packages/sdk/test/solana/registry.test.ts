import { ThirdwebSDK } from "../../src/solana";
import { createTestSDK } from "./before-setup";
import { expect } from "chai";

describe("Registry", async () => {
  let nftColl: string;
  let nftDrop: string;
  let token: string;
  let freshSDK: ThirdwebSDK;

  before(async () => {
    freshSDK = await createTestSDK();
    // nftColl = await freshSDK.deployer.createNftCollection({
    //   name: "Reg Test Collection",
    //   description: "Test Description",
    //   symbol: "TC",
    // });
  });

  it("deploying should create entries in the registry", async () => {
    const wallet = freshSDK.wallet.getAddress();
    nftColl = await freshSDK.deployer.createNftCollection({
      name: "Reg Test Collection",
      description: "Test Description",
      symbol: "TC",
    });
    console.log({ nftColl });
    token = await freshSDK.deployer.createToken({
      name: "Reg Test Token",
      initialSupply: 100,
    });
    console.log({ token });
    nftDrop = await freshSDK.deployer.createNftDrop({
      name: "Reg Test Drop",
      itemsAvailable: 10,
    });
    console.log({ nftDrop });
    const allPrograms = await freshSDK.registry.getDeployedPrograms(wallet);
    console.log(allPrograms);
    expect(allPrograms).length(3);
    expect(allPrograms[0].programName).to.equal("Reg Test Collection");
    expect(allPrograms[0].programType).to.equal("nft-collection");
    expect(allPrograms[1].programName).to.equal("Reg Test Token");
    expect(allPrograms[1].programType).to.equal("token");
    expect(allPrograms[2].programName).to.equal("Reg Test Drop");
    expect(allPrograms[2].programType).to.equal("nft-drop");
  });
  /**
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
*/
  it("should resolve account addresses", async () => {
    expect(await freshSDK.registry.getProgramType(nftColl)).to.eq(
      "nft-collection",
    );
    expect(await freshSDK.registry.getProgramType(nftDrop)).to.eq("nft-drop");
    expect(await freshSDK.registry.getProgramType(token)).to.eq("token");
  });
});
