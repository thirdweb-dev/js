import { assert } from "chai";
import {
  AbiSchema,
  SmartContract,
  ThirdwebSDK,
  assertEnabled,
  detectContractFeature,
  isExtensionEnabled,
  isFeatureEnabled,
} from "../../src/evm";
import { jsonProvider, sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  CoreRouter__factory,
  DirectListingsLogic__factory,
  OffersLogic__factory,
} from "@thirdweb-dev/contracts-js";
import { deployContractAndUploadMetadata } from "./utils";
import { Extension, ExtensionFunction } from "../../src/evm/types/extension";
import { generateExtensionFunctions } from "../../src/evm/common/plugin/generatePluginFunctions";
import invariant from "tiny-invariant";

describe("Base Router for Dynamic Contracts", async () => {
  let adminWallet: SignerWithAddress;
  let randomSigner: SignerWithAddress;
  let coreRouterAddress: string;
  let coreRouter: SmartContract;

  beforeEach(async () => {
    await jsonProvider.send("hardhat_reset", []);
    [adminWallet, randomSigner] = signers;

    // deploy base router
    coreRouterAddress = await deployContractAndUploadMetadata(
      CoreRouter__factory.abi,
      CoreRouter__factory.bytecode,
      adminWallet,
      [adminWallet.address],
    );

    // instantiate custom contract
    coreRouter = await sdk.getContract(coreRouterAddress);
  });

  it("should detect base router in a dynamic contract", async () => {
    const realSDK = new ThirdwebSDK("ethereum");

    // test with an already deployed contract, like tiered drop etc.
    const tieredDropAddress = "0x4a8ac7f22ded2cf923a51e4a1c67490bd8868add";
    const contract = await realSDK.getContract(tieredDropAddress);

    assert(isExtensionEnabled(contract.abi, "DynamicContract"));
  });

  it("should get extensions", async () => {
    const realSDK = new ThirdwebSDK("ethereum");

    // test with an already deployed contract
    const tieredDropAddress = "0x4a8ac7f22ded2cf923a51e4a1c67490bd8868add";
    const contract = await realSDK.getContract(tieredDropAddress);

    const extensionMetadata = await contract.extensions.getAll();
    const extensionNames = extensionMetadata.map((ext) => ext.metadata.name);

    assert(extensionNames.includes("TieredDropLogic"));
  });

  it("should add extensions", async () => {
    // deploy an extension contract
    // Offers
    const offersLogicAddress = await deployContractAndUploadMetadata(
      OffersLogic__factory.abi,
      OffersLogic__factory.bytecode,
      adminWallet,
      [],
    );

    // generate functions array for the extension
    const extensionFunctions: ExtensionFunction[] = generateExtensionFunctions(
      AbiSchema.parse(OffersLogic__factory.abi),
    );

    const routerInput: Extension = {
      metadata: {
        name: "OffersLogic",
        metadataURI: "",
        implementation: offersLogicAddress,
      },
      functions: extensionFunctions,
    };

    // add extension
    await coreRouter.extensions.add(routerInput);

    // read extension
    const extensions = await coreRouter.extensions.getAll();
    assert(extensions.length === 1);
    assert(extensions[0].metadata.name === "OffersLogic");

    // call function on extension
    const totalOffers = await coreRouter.offers.getTotalCount();
    assert(totalOffers.eq(0));
  });

  it("should add extensions with abi", async () => {
    // deploy an extension contract
    // Offers
    const offersLogicAddress = await deployContractAndUploadMetadata(
      OffersLogic__factory.abi,
      OffersLogic__factory.bytecode,
      adminWallet,
      [],
    );

    // add extension
    await coreRouter.extensions.addWithAbi(
      "OffersLogic",
      offersLogicAddress,
      OffersLogic__factory.abi,
    );

    // read extension
    const extensions = await coreRouter.extensions.getAll();
    assert(extensions.length === 1);
    assert(extensions[0].metadata.name === "OffersLogic");
  });

  it("should update extensions", async () => {
    // deploy an extension contract
    // Offers
    const offersLogicAddress = await deployContractAndUploadMetadata(
      OffersLogic__factory.abi,
      OffersLogic__factory.bytecode,
      adminWallet,
      [],
    );

    // add extension
    await coreRouter.extensions.addWithAbi(
      "OffersLogic",
      offersLogicAddress,
      OffersLogic__factory.abi,
    );

    // read extension
    let extensions = await coreRouter.extensions.getAll();
    assert(extensions.length === 1);
    assert(extensions[0].metadata.name === "OffersLogic");

    // update extension
    const newAddress = await deployContractAndUploadMetadata(
      OffersLogic__factory.abi,
      OffersLogic__factory.bytecode,
      adminWallet,
      [],
    );
    const newFunctions: ExtensionFunction[] = generateExtensionFunctions(
      AbiSchema.parse(DirectListingsLogic__factory.abi), // arbitrary set of functions
    );

    invariant(newFunctions, "");
    const routerInput: Extension = {
      metadata: {
        name: "OffersLogic",
        metadataURI: "",
        implementation: newAddress,
      },
      functions: newFunctions,
    };
    await coreRouter.extensions.update(routerInput);

    // read extension
    extensions = await coreRouter.extensions.getAll();
    assert(extensions.length === 1);
    assert(extensions[0].metadata.name === "OffersLogic");
    assert(extensions[0].metadata.implementation === newAddress);
  });

  it("should update extensions with abi", async () => {
    // deploy an extension contract
    // Offers
    const offersLogicAddress = await deployContractAndUploadMetadata(
      OffersLogic__factory.abi,
      OffersLogic__factory.bytecode,
      adminWallet,
      [],
    );

    // add extension
    await coreRouter.extensions.addWithAbi(
      "OffersLogic",
      offersLogicAddress,
      OffersLogic__factory.abi,
    );

    // read extension
    let extensions = await coreRouter.extensions.getAll();
    assert(extensions.length === 1);
    assert(extensions[0].metadata.name === "OffersLogic");

    // update extension
    const newAddress = await deployContractAndUploadMetadata(
      OffersLogic__factory.abi,
      OffersLogic__factory.bytecode,
      adminWallet,
      [],
    );
    await coreRouter.extensions.updateWithAbi(
      "OffersLogic",
      newAddress,
      DirectListingsLogic__factory.abi,
    );

    // read extension
    extensions = await coreRouter.extensions.getAll();
    assert(extensions.length === 1);
    assert(extensions[0].metadata.name === "OffersLogic");
    assert(extensions[0].metadata.implementation === newAddress);
  });

  it("should remove extensions", async () => {
    // deploy an extension contract
    // Offers
    const offersLogicAddress = await deployContractAndUploadMetadata(
      OffersLogic__factory.abi,
      OffersLogic__factory.bytecode,
      adminWallet,
      [],
    );

    const extensionFunctions: ExtensionFunction[] = generateExtensionFunctions(
      AbiSchema.parse(OffersLogic__factory.abi),
    );

    const routerInput: Extension = {
      metadata: {
        name: "OffersLogic",
        metadataURI: "",
        implementation: offersLogicAddress,
      },
      functions: extensionFunctions,
    };

    // add extension
    await coreRouter.extensions.add(routerInput);

    // read extension
    let extensions = await coreRouter.extensions.getAll();
    assert(extensions.length === 1);
    assert(extensions[0].metadata.name === "OffersLogic");

    // remove extension
    await coreRouter.extensions.remove(routerInput);

    // read extension
    extensions = await coreRouter.extensions.getAll();
    assert(extensions.length === 0);
  });

  it("should get extension for function", async () => {
    // deploy an extension contract
    // Offers
    const offersLogicAddress = await deployContractAndUploadMetadata(
      OffersLogic__factory.abi,
      OffersLogic__factory.bytecode,
      adminWallet,
      [],
    );

    // generate functions array for the extension
    const extensionFunctions: ExtensionFunction[] = generateExtensionFunctions(
      AbiSchema.parse(OffersLogic__factory.abi),
    );

    const routerInput: Extension = {
      metadata: {
        name: "OffersLogic",
        metadataURI: "",
        implementation: offersLogicAddress,
      },
      functions: extensionFunctions,
    };

    // add extension
    await coreRouter.extensions.add(routerInput);

    // read extension
    const extension = await coreRouter.extensions.getExtensionForFunction({
      functionSignature: "acceptOffer(uint256)",
    });
    assert(extension.implementation === offersLogicAddress);
    assert(extension.name === "OffersLogic");
  });
});
