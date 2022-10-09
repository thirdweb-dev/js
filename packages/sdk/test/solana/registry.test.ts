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
  });

  it("deploying should create entries in the registry", async () => {
    const wallet = freshSDK.wallet.getAddress();
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
    const allPrograms = await freshSDK.registry.getDeployedPrograms(wallet);
    expect(allPrograms).length(3);
    expect(allPrograms[0].programName).to.equal("Reg Test Collection");
    expect(allPrograms[0].programType).to.equal("nft-collection");
    expect(allPrograms[1].programName).to.equal("Reg Test Token");
    expect(allPrograms[1].programType).to.equal("token");
    expect(allPrograms[2].programName).to.equal("Reg Test Drop");
    expect(allPrograms[2].programType).to.equal("nft-drop");
  });

  it("should resolve account addresses", async () => {
    expect(await freshSDK.registry.getProgramType(nftColl)).to.eq(
      "nft-collection",
    );
    expect(await freshSDK.registry.getProgramType(nftDrop)).to.eq("nft-drop");
    expect(await freshSDK.registry.getProgramType(token)).to.eq("token");
  });
});
