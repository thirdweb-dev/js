import { SmartContract } from "../../src/evm/contracts/smart-contract";
import {
  extendedMetadataMock,
  jsonProvider,
  signers,
  sdk,
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
  erc721CoreBytecode,
  erc721CoreCompilerMetadata,
} from "./mock/erc721CoreMetadata";
import {
  mintHookERC721Bytecode,
  mintHookERC721CompilerMetadata,
} from "./mock/mintHookERC721Metadata";

const itIf = (condition: boolean) => (condition ? it : it.skip);

describe("Any EVM Keyless Deploy", async () => {
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
      "ModularFactory",
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
        publisher: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
      },
      "ipfs://QmQ28neprkwWS7e4L1AMFchKqzxUdfYBKgfnPMQuy5p9qK",
    );

    process.env.contractPublisherAddress = mockPublisher;
  }

  async function mockPublishMintHook() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";

    const publishUri = await mockUploadMetadataWithBytecode(
      "MintHookERC721",
      mintHookERC721CompilerMetadata.output.abi,
      mintHookERC721Bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
      },
      "ipfs://QmNVUKxrsLSKd44HqVGDP2kRyu3djCcErgkTnoQeMwFgXY",
    );

    process.env.contractPublisherAddress = mockPublisher;
  }

  async function mockPublishAndDeployERC721Core() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";

    const publishUri = await mockUploadMetadataWithBytecode(
      "ERC721Core",
      erc721CoreCompilerMetadata.output.abi,
      erc721CoreBytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "autoFactory",
        routerType: "modular",
        defaultExtensions: [
          {
            extensionName: "MintHookERC721",
            extensionVersion: "latest",
            publisherAddress: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
          },
        ],
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
      },
      "ipfs://QmQqCaF5RBdyL8mCbGC6QELqqDxuyFLebbCwy4go3oLxBQ",
    );

    const walletAddress = await sdk.wallet.getAddress();

    const address = await sdk.deployer.deployContractFromUri(
      publishUri,
      [
        "",
        [],
        walletAddress,
        "Core", // name
        "Core", // symbol
        "ipfs://QmUj5kNz7Xe5AEhV2YvHiCKfMSL5YZpD4E18QLLYEsGBcd/0", // contractUri
      ],
      {
        forceDirectDeploy: false,
        hooks: [
          {
            addressOrName: "MintHookERC721",
            publisherAddress: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
          },
        ],
      },
    );

    process.env.contractPublisherAddress = mockPublisher;
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
    await mockPublishMintHook();
    await mockPublishAndDeployERC721Core();
  });
});
