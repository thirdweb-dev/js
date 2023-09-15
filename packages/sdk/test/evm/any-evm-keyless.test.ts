import { ThirdwebSDK } from "../../src/evm";
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
  tieredDropBytecode,
  tieredDropCompilerMetadata,
} from "./mock/tieredDropMetadata";
import {
  DirectListingsLogic__factory,
  EnglishAuctionsLogic__factory,
  OffersLogic__factory,
} from "@thirdweb-dev/contracts-js";
import {
  marketplaceV3Bytecode,
  marketplaceV3CompilerMetadata,
} from "./mock/marketplaceV3Metadata";
import {
  pluginMapBytecode,
  pluginMapCompilerMetadata,
} from "./mock/pluginMapMetadata";

describe("Any EVM Keyless Deploy", async () => {
  let contract: SmartContract;
  let adminWallet: SignerWithAddress;
  let claimerWallet: SignerWithAddress;
  let notificationCounter: number;
  let transactionCount: number;

  async function deployTieredDrop() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    const walletAddress = await sdk.wallet.getAddress();

    // This needs to match the published contract for the currently used ABI
    // "ipfs://QmXu9ezFNgXBX1juLZ7kwdf5KpTD1x9GPHnk14QB2NpUvK/0";
    // "ipfs://QmRj8VEy1nA287YM6UKf4eTAzYk7f4PRciiqVoer6NN6wd/0";
    const publishUri = await mockUploadMetadataWithBytecode(
      "TieredDrop",
      tieredDropCompilerMetadata.output.abi,
      tieredDropBytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "autoFactory",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: await adminWallet.getAddress(),
      },
      "ipfs://QmXu9ezFNgXBX1juLZ7kwdf5KpTD1x9GPHnk14QB2NpUvK/0",
    );

    transactionCount = (await sdk.deployer.getTransactionsForDeploy(publishUri))
      .length;

    const address = await sdk.deployer.deployContractFromUri(
      publishUri,
      [
        walletAddress, // defaultAdmin
        "Tiered Drop #1", // name
        "TD", // symbol
        "ipfs://QmUj5kNz7Xe5AEhV2YvHiCKfMSL5YZpD4E18QLLYEsGBcd/0", // contractUri
        [], // trustedForwarders
        walletAddress, // saleRecipient
        walletAddress, // royaltyRecipient
        0, // royaltyBps
      ],
      {
        forceDirectDeploy: false,
        notifier(status, contractType) {
          notificationCounter += 1;
        },
      },
    );

    process.env.contractPublisherAddress = mockPublisher;
    const tieredDrop = await sdk.getContract(address);

    return tieredDrop;
  }

  async function deployMarketplaceV3() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    const walletAddress = await sdk.wallet.getAddress();

    // This needs to match the published contract for the currently used ABI
    // const publishUri = "ipfs://QmP2QPzc81zg5rqhU9u7cDeSyD4aZH8RdVF8Nuh6rCCgxV";
    // "ipfs://QmaibbXVEJSdW2xkbsVpGq6PKiqspi9LKaT22hoLjigtMt/0";
    const publishUri =
      // "ipfs://QmVMYjPmtsQCxzbPALaXE2WwhnGE8F6mNn4FQE8iAqUTuD/0";
      // "ipfs://QmaE7HVb4nwHp96omxmyPc7nKPZqsGB7ZbW6psznN6cSMk/";
      await mockUploadMetadataWithBytecode(
        "MarketplaceV3",
        marketplaceV3CompilerMetadata.output.abi,
        marketplaceV3Bytecode,
        "",
        {
          ...extendedMetadataMock,
          deployType: "autoFactory",
          routerType: "plugin",
          defaultExtensions: [
            {
              extensionName: "DirectListingsLogic",
              extensionVersion: "latest",
              publisherAddress: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
            },
            {
              extensionName: "EnglishAuctionsLogic",
              extensionVersion: "latest",
              publisherAddress: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
            },
            {
              extensionName: "OffersLogic",
              extensionVersion: "latest",
              publisherAddress: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
            },
          ],
          networksForDeployment: {
            allNetworks: true,
            networksEnabled: [],
          },
          publisher: await adminWallet.getAddress(),
        },
        "ipfs://QmaE7HVb4nwHp96omxmyPc7nKPZqsGB7ZbW6psznN6cSMk",
      );
    transactionCount = (await sdk.deployer.getTransactionsForDeploy(publishUri))
      .length;

    const address = await sdk.deployer.deployContractFromUri(
      publishUri,
      [
        walletAddress, // defaultAdmin
        "ipfs://QmP2QPzc81zg5rqhU9u7cDeSyD4aZH8RdVF8Nuh6rCCgxV", // contractUri
        [], // trustedForwarders
        walletAddress, // platform fee recipient
        0, // platform fee bps
      ],
      {
        forceDirectDeploy: false,
        notifier(status, contractType) {
          notificationCounter += 1;
        },
      },
    );

    const marketplace = await sdk.getContract(address);
    process.env.contractPublisherAddress = mockPublisher;

    return marketplace;
  }

  before(async () => {
    [adminWallet, claimerWallet] = signers;

    await mockUploadMetadataWithBytecode(
      "PluginMap",
      pluginMapCompilerMetadata.output.abi,
      pluginMapBytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: adminWallet.address,
      },
      "ipfs://QmQHyopzH41En8KxvYrmATLCyuTMu8Hv5TEaxLc7gWJkLm/0",
    );

    await mockUploadMetadataWithBytecode(
      "DirectListingsLogic",
      DirectListingsLogic__factory.abi,
      DirectListingsLogic__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: adminWallet.address,
      },
      "ipfs://QmPDuyh4iAj79Cv2gcUgxELeKr4kz72LF7vRvosRkRbcq5/0",
    );

    await mockUploadMetadataWithBytecode(
      "OffersLogic",
      OffersLogic__factory.abi,
      OffersLogic__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: adminWallet.address,
      },
      "ipfs://Qmb2t399P7ZoFCjn5WSkxfVHj3TnSYjdp19FyTpYec9DP4/0",
    );

    await mockUploadMetadataWithBytecode(
      "EnglishAuctionsLogic",
      EnglishAuctionsLogic__factory.abi,
      EnglishAuctionsLogic__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: adminWallet.address,
      },
      "ipfs://QmRQEuSAwVswHhpNjBGydybsWdD2DExi2Mv8iXJBvYAuxV/0",
    );
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    await jsonProvider.send("hardhat_reset", []);
  });

  it("correct count of logs and transactions", async () => {
    notificationCounter = 0;
    transactionCount = 0;
    contract = await deployTieredDrop();
    expect(notificationCounter).to.equal(8);
    expect(transactionCount).to.equal(4);

    notificationCounter = 0;
    transactionCount = 0;
    contract = await deployTieredDrop();
    expect(notificationCounter).to.equal(2);
    expect(transactionCount).to.equal(1);
  });

  it("deploy marketplacev3", async () => {
    notificationCounter = 0;
    transactionCount = 0;
    const marketplace = await deployMarketplaceV3();
    expect(notificationCounter).to.greaterThanOrEqual(12);
    expect(transactionCount).to.greaterThanOrEqual(6);

    let plugins = await marketplace.call("getAllPlugins");
    let allPlugins = plugins.map((item: any) => item.pluginAddress);
    let pluginsAddresses = Array.from(new Set(allPlugins));

    expect(pluginsAddresses.length).to.equal(3);

    pluginsAddresses.forEach(async (address) => {
      expect(address).to.not.equal(ethers.constants.AddressZero);
      const code = await adminWallet.provider?.getCode(address as string);
      expect(code?.length).to.be.greaterThan(2);
    });

    // deploy again
    notificationCounter = 0;
    transactionCount = 0;
    const marketplace2 = await deployMarketplaceV3();
    expect(notificationCounter).to.equal(2);
    expect(transactionCount).to.equal(1);

    plugins = await marketplace2.call("getAllPlugins");
    allPlugins = plugins.map((item: any) => item.pluginAddress);
    pluginsAddresses = Array.from(new Set(allPlugins));

    expect(pluginsAddresses.length).to.equal(3);

    pluginsAddresses.forEach(async (address) => {
      expect(address).to.not.equal(ethers.constants.AddressZero);
      const code = await adminWallet.provider?.getCode(address as string);
      expect(code?.length).to.be.greaterThan(2);
    });
  });
});
