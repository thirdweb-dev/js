import { assert } from "console";
import { ThirdwebSDK, isExtensionEnabled } from "../../src/evm";
import { jsonProvider, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Base Router for Dynamic Contracts", async () => {
  let adminWallet: SignerWithAddress;

  //   beforeEach(async () => {
  //     await jsonProvider.send("hardhat_reset", []);
  //     [adminWallet] = signers;
  //   });

  it("should detect base router in a dynamic contract", async () => {
    const realSDK = new ThirdwebSDK("ethereum");

    // test with an already deployed contract, like tiered drop etc.
    const tieredDropAddress = "0x4a8ac7f22ded2cf923a51e4a1c67490bd8868add";
    const contract = await realSDK.getContract(tieredDropAddress);

    assert(isExtensionEnabled(contract.abi, "BaseRouter"));
  });

  it("should get extensions", async () => {
    const realSDK = new ThirdwebSDK("ethereum");

    // test with an already deployed contract
    const tieredDropAddress = "0x4a8ac7f22ded2cf923a51e4a1c67490bd8868add";
    const contract = await realSDK.getContract(tieredDropAddress);

    const extensionMetadata = await contract.baseRouter.getAllExtensions();
    const extensionNames = extensionMetadata.map((ext) => ext.name);

    assert(extensionNames.includes("TieredDropLogic"));
  });

  it("should add extensions", async () => {
    // deploy base router
    // deploy an extension contract
    // add extension
    // get contract
    // read extension
    // call function on extension
  });

  it("should update extensions", async () => {
    // deploy base router
    // deploy an extension contract
    // add extension
    // update extension
    // get contract
    // read extension
    // call function on extension
  });

  it("should remove extensions", async () => {
    // deploy base router
    // deploy an extension contract
    // add extension
    // remove extension
    // get contract
    // read extension
    // call function on extension - should revert
  });
});
