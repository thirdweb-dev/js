import {
  extendedMetadataMock,
  jsonProvider,
  signers,
  sdk,
} from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  mockCoreBytecode,
  mockCoreCompilerMetadata,
  mockCoreDeployedBytecode,
} from "./mock/mockCoreMetadata";
import {
  mockExtensionWithFunctionsBytecode,
  mockExtensionWithFunctionsCompilerMetadata,
} from "./mock/mockExtensionWithFunctionsMetadata";
import { compatibleExtensions } from "../../src/evm/common/modular/compatibleExtensions";
import { mockExtensionWithInterfaceBytecode } from "./mock/mockExtensionWithInterface";

describe("Modular contract deployment", async () => {
  let adminWallet: SignerWithAddress;

  async function mockPublishExtension() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";

    const publishUri = await mockUploadMetadataWithBytecode(
      "DemoExtensionWithFunctions",
      mockExtensionWithFunctionsCompilerMetadata.output.abi,
      mockExtensionWithFunctionsBytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: await adminWallet.getAddress(),
      },
      "ipfs://QmbAYkPwB2V8E8Phs62TFAoAa9fuP74DZFD2uCiSNAHpVb/0",
    );

    process.env.contractPublisherAddress = mockPublisher;

    return publishUri;
  }

  async function mockPublishAndDeployMockCore() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";

    const publishUri = await mockUploadMetadataWithBytecode(
      "DemoCore",
      mockCoreCompilerMetadata.output.abi,
      mockCoreBytecode,
      mockCoreDeployedBytecode,
      {
        ...extendedMetadataMock,
        deployType: "autoFactory",
        routerType: "modular",
        defaultExtensions: [
          {
            extensionName: "DemoExtensionWithFunctions",
            extensionVersion: "",
            publisherAddress: await adminWallet.getAddress(),
          },
        ],
        factoryDeploymentData: {
          implementationAddresses: {},
          factoryAddresses: {},
          implementationInitializerFunction: "initialize",

          modularFactoryInput: { hooksParamName: "extensions" },
        },
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: await adminWallet.getAddress(),
      },
      "ipfs://QmbQLyXkhkF2tF6nSbB9TaXUShaLbEWMi11zuR5U5mfz2X/0",
    );

    const walletAddress = await sdk.wallet.getAddress();

    const address = await sdk.deployer.deployContractFromUri(
      publishUri,
      [walletAddress, [], ["0x"]],
      {
        forceDirectDeploy: false,
      },
    );

    const core = await sdk.getContract(address);

    process.env.contractPublisherAddress = mockPublisher;

    return core;
  }

  before(async () => {
    [adminWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    await jsonProvider.send("hardhat_reset", []);
  });

  it("should deploy core but not install hooks", async () => {
    // await mockPublishModularFactory();
    await mockPublishExtension();
    const mockCore = await mockPublishAndDeployMockCore();

    const extensions = await mockCore.call("getInstalledExtensions");

    expect(extensions.length).to.equal(0);
  });

  it("should check extension compatibility", async () => {
    // duplicate callback/fallback
    let isCompatible = await compatibleExtensions(
      mockCoreBytecode,
      [mockExtensionWithFunctionsBytecode, mockExtensionWithFunctionsBytecode],
      11155111,
    );

    expect(isCompatible).to.be.false;

    // required interface not supported
    isCompatible = await compatibleExtensions(
      mockCoreBytecode,
      [mockExtensionWithInterfaceBytecode],
      11155111,
    );

    expect(isCompatible).to.be.false;
  });
});
