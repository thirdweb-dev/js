import { assert } from "console";
import { AbiSchema, ThirdwebSDK, isExtensionEnabled } from "../../src/evm";
import { jsonProvider, sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";
import { CoreRouter, CoreRouter__factory, OffersLogic__factory } from "@thirdweb-dev/contracts-js";
import { deployContractAndUploadMetadata } from "./utils";
import { Extension, ExtensionFunction } from "../../src/evm/types/extension";
import { generateExtensionFunctions } from "../../src/evm/common/plugin/generatePluginFunctions";

describe("Base Router for Dynamic Contracts", async () => {
  let adminWallet: SignerWithAddress;
  let randomSigner: SignerWithAddress;

    beforeEach(async () => {
      await jsonProvider.send("hardhat_reset", []);
      [adminWallet, randomSigner] = signers;
    });

  it.skip("should detect base router in a dynamic contract", async () => {
    const realSDK = new ThirdwebSDK("ethereum");

    // test with an already deployed contract, like tiered drop etc.
    const tieredDropAddress = "0x4a8ac7f22ded2cf923a51e4a1c67490bd8868add";
    const contract = await realSDK.getContract(tieredDropAddress);

    assert(isExtensionEnabled(contract.abi, "BaseRouter"));
  });

  it.skip("should get extensions", async () => {
    const realSDK = new ThirdwebSDK("ethereum");

    // test with an already deployed contract
    const tieredDropAddress = "0x4a8ac7f22ded2cf923a51e4a1c67490bd8868add";
    const contract = await realSDK.getContract(tieredDropAddress);

    const extensionMetadata = await contract.baseRouter.getAllExtensions();
    const extensionNames = extensionMetadata.map((ext) => ext.name);

    assert(extensionNames.includes("TieredDropLogic"));
  });

  it("should add extensions", async () => {
    const realSDK = new ThirdwebSDK(31337);
    // deploy base router
    const coreRouterAddress = await deployContractAndUploadMetadata(CoreRouter__factory.abi, CoreRouter__factory.bytecode, adminWallet, [adminWallet.address]);

    // instantiate custom contract
    const contract = await sdk.getContract(coreRouterAddress);

    // deploy an extension contract
    // Offers
    const offersLogicAddress = await deployContractAndUploadMetadata(OffersLogic__factory.abi, OffersLogic__factory.bytecode, adminWallet, []);

    const extensionFunctions: ExtensionFunction[] = generateExtensionFunctions(
      AbiSchema.parse(OffersLogic__factory.abi),
    );

    const routerInput: Extension[] = [];
    routerInput.push({
      metadata: {
        name: "OffersLogic",
        metadataURI: "",
        implementation:
          offersLogicAddress,
      },
      functions: extensionFunctions,
    });
    
    // add extension
    await contract.baseRouter.addExtension(routerInput[0]);

    // read extension
    const extensions = await contract.baseRouter.getAllExtensions();
    assert(extensions.length === 1);
    assert(extensions[0].name === "OffersLogic");
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
