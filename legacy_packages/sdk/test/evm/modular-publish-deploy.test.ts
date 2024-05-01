import { SmartContract } from "../../src/evm/contracts/smart-contract";
import {
  extendedMetadataMock,
  jsonProvider,
  signers,
  sdk,
  hardhatEthers,
} from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "ethers";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  modularFactoryBytecode,
  modularFactoryCompilerMetadata,
} from "./mock/modularFactoryMetadata";
import {
  erc20CoreInitializableBytecode,
  erc20CoreInitializableCompilerMetadata,
  erc20CoreInitializableDeployedBytecode,
} from "./mock/erc20CoreInitializableMetadata";
import {
  mockExtensionERC20Bytecode,
  mockExtensionERC20CompilerMetadata,
} from "./mock/mockExtensionERC20Metadata";
import { AddressZero } from "../../src/evm/constants/addresses/AddressZero";

describe("Modular contract deployment", async () => {
  let contract: SmartContract;
  let adminWallet: SignerWithAddress;
  let claimerWallet: SignerWithAddress;
  let notificationCounter: number;
  let transactionCount: number;

  async function mockPublishModularFactory() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";
    const publishUri = await mockUploadMetadataWithBytecode(
      "CloneFactory",
      modularFactoryCompilerMetadata.output.abi,
      modularFactoryBytecode,
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
      "ipfs://QmPeYVS1RXKRqYa1Xdh8yBNUiGF8ugPZcoBwU7udLfS85c/0",
    );

    process.env.contractPublisherAddress = mockPublisher;
  }

  async function mockPublishExtension() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";

    const publishUri = await mockUploadMetadataWithBytecode(
      "DemoExtensionERC20",
      mockExtensionERC20CompilerMetadata.output.abi,
      mockExtensionERC20Bytecode,
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
      "ipfs://QmR9mHiNGWbd3wuKs7Jerh1kVdg62tLutYvEjKBovaYTQj/0",
    );

    process.env.contractPublisherAddress = mockPublisher;

    return publishUri;
  }

  async function mockPublishAndDeployERC20Core() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";

    const publishUri = await mockUploadMetadataWithBytecode(
      "ERC20Core",
      erc20CoreInitializableCompilerMetadata.output.abi,
      erc20CoreInitializableBytecode,
      erc20CoreInitializableDeployedBytecode,
      {
        ...extendedMetadataMock,
        deployType: "autoFactory",
        routerType: "modular",
        defaultExtensions: [
          {
            extensionName: "DemoExtensionERC20",
            extensionVersion: "latest",
            publisherAddress: await adminWallet.getAddress(),
          },
        ],
        factoryDeploymentData: {
          implementationAddresses: {},
          factoryAddresses: {},
          implementationInitializerFunction: "initialize",

          modularFactoryInput: { hooksParamName: "_extensionsToInstall" },
        },
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: await adminWallet.getAddress(),
      },
      "ipfs://QmbaWoSoAtQBN2mA6ULEqkQDNayUsjjvjeCnHK6KpaQ9bF/0",
    );

    const walletAddress = await sdk.wallet.getAddress();

    const address = await sdk.deployer.deployContractFromUri(
      publishUri,
      [
        "Core", // name
        "Core", // symbol
        "ipfs://QmUj5kNz7Xe5AEhV2YvHiCKfMSL5YZpD4E18QLLYEsGBcd/0", // contractUri
        walletAddress,
        [],
        AddressZero,
        "0x"
      ],
      {
        forceDirectDeploy: false,
        hooks: [
          {
            extensionName: "DemoExtensionERC20",
            extensionVersion: "latest",
            publisherAddress: "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
          },
        ],
      },
    );

    const core = await sdk.getContract(address);

    process.env.contractPublisherAddress = mockPublisher;

    return core;
  }

  before(async () => {
    [adminWallet, claimerWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    await jsonProvider.send("hardhat_reset", []);
  });

  it("should deploy core and install hooks", async () => {
    await mockPublishModularFactory();
    await mockPublishExtension();
    const erc20core = await mockPublishAndDeployERC20Core();

    const extensions = await erc20core.call("getInstalledExtensions");

    expect(extensions.length).to.equal(1);
    expect(extensions[0].implementation).to.not.equal(AddressZero);
  });

    it("should check admin role for upgrade", async () => {
      const upgradeCheckAbi = [
        {
          type: "function",
          name: "upgradeToAndCall",
          inputs: [
            {
              name: "newImplementation",
              type: "address",
              internalType: "address",
            },
            { name: "data", type: "bytes", internalType: "bytes" },
          ],
          outputs: [],
          stateMutability: "payable",
        },
      ];
      await mockPublishModularFactory();
      await mockPublishExtension();
      const erc20core = await mockPublishAndDeployERC20Core();

      const extensions = await erc20core.call("getInstalledExtensions");

      const extEthersContract = new hardhatEthers.Contract(
        extensions[0].implementation,
        upgradeCheckAbi,
        sdk.getSigner(),
      );

      const publishUri = await mockPublishExtension();
      const newExtensionImpl = await sdk.deployer.deployContractFromUri(
        publishUri,
        [],
      );

      try {
        await extEthersContract.upgradeToAndCall(newExtensionImpl, []);
      } catch (e) {
        expect(e.message.includes("0xd562cd03")).to.be.true;
      }
    });
});
