import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { sdk, signers } from "./before-setup";
import { expect } from "chai";
import { ContractRegistry } from "../src/core/classes/registry";

describe("Contract Registry", () => {
  let registry: ContractRegistry;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  let address: string;

  before(async () => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  it("should allow adding and removing contracts", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    registry = await sdk.deployer.getRegistry();

    address = await sdk.deployer.deployNFTCollection({
      name: "Test1",
      primary_sale_recipient: adminWallet.address,
    });

    let contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.contain(address);

    await registry.removeContract(address);
    contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.not.contain(address);

    await registry.addContract(address);
    contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.contain(address);
  });

  it("should allow deploying after removing", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    registry = await sdk.deployer.getRegistry();

    address = await sdk.deployer.deployNFTCollection({
      name: "Test1",
      primary_sale_recipient: adminWallet.address,
    });

    let contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.contain(address);

    await registry.removeContract(address);
    contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.not.contain(address);

    address = await sdk.deployer.deployNFTCollection({
      name: "Test1",
      primary_sale_recipient: adminWallet.address,
    });
    const contracts2 = await registry.getContractAddresses(adminWallet.address);
    expect(contracts2).to.contain(address);
  });
});
