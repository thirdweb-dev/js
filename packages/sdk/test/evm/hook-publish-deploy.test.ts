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
  modularFactoryDeployedBytecode,
} from "./mock/modularFactoryMetadata";
import {
  erc721CoreBytecode,
  erc721CoreCompilerMetadata,
  erc721CoreDeployedBytecode,
} from "./mock/erc721CoreMetadata";
import {
  mintHookERC721Bytecode,
  mintHookERC721CompilerMetadata,
  mintHookERC721DeployedBytecode,
} from "./mock/mintHookERC721Metadata";
import { AddressZero } from "../../src/evm/constants/addresses/AddressZero";

const itIf = (condition: boolean) => (condition ? it : it.skip);

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
        publisher: await adminWallet.getAddress(),
      },
      "ipfs://QmRAhA8EjcEF33SZWrksLmJqAhK1q1ThWfDfX4xNhaHuHm/0",
    );

    process.env.contractPublisherAddress = mockPublisher;

    return publishUri;
  }

  async function mockPublishAndDeployERC721Core() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";

    const publishUri = await mockUploadMetadataWithBytecode(
      "ERC721Core",
      erc721CoreCompilerMetadata.output.abi,
      erc721CoreBytecode,
      erc721CoreDeployedBytecode,
      {
        ...extendedMetadataMock,
        deployType: "modular",
        routerType: "modular",
        defaultExtensions: [
          {
            extensionName: "MintHookERC721",
            extensionVersion: "latest",
            publisherAddress: await adminWallet.getAddress(),
          },
        ],
        factoryDeploymentData: {
          implementationAddresses: {},
          factoryAddresses: {},
          implementationInitializerFunction: "initialize",

          modularFactoryInput: { hooksParamName: "_hooks" },
        },
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: await adminWallet.getAddress(),
      },
      "ipfs://QmSzA36LLqqVtzvBw4AQ4cD7iagicHJKJdTJFVGn2KdkbA/1",
    );

    const walletAddress = await sdk.wallet.getAddress();
    const initCall = {
      target: AddressZero,
      value: 0,
      data: [],
    };

    const address = await sdk.deployer.deployContractFromUri(
      publishUri,
      [
        initCall,
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
    await mockPublishMintHook();
    const erc721core = await mockPublishAndDeployERC721Core();

    const hooks = await erc721core.call("getAllHooks");

    expect(hooks.beforeMint).to.not.equal(AddressZero);
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
      {
        type: "function",
        name: "ADMIN_ROLE_BITS",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "hasRole",
        inputs: [
          { name: "_account", type: "address", internalType: "address" },
          { name: "_roleBits", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
    ];
    await mockPublishModularFactory();
    await mockPublishMintHook();
    const erc721core = await mockPublishAndDeployERC721Core();

    const hooks = await erc721core.call("getAllHooks");

    const beforeMint = await sdk.getContract(hooks.beforeMint, upgradeCheckAbi);

    // await beforeMint.call("ADMIN_ROLE_BITS");

    const isAdmin = await beforeMint.call("hasRole", [
      "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
      ethers.utils.defaultAbiCoder.encode(["uint256"], [2 ** 1]),
    ]);
    expect(isAdmin).to.be.true;

    const beforeMintEthersContract = new hardhatEthers.Contract(
      hooks.beforeMint,
      upgradeCheckAbi,
      sdk.getSigner(),
    );

    const publishUri = await mockPublishMintHook();
    const newHookImpl = await sdk.deployer.deployContractFromUri(
      publishUri,
      [],
    );

    try {
      await beforeMintEthersContract.upgradeToAndCall(newHookImpl, []);
    } catch (e) {
      expect(e.message.includes("0xd562cd03")).to.be.true;
    }
  });
});
