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
  marketplaceV3Bytecode,
  marketplaceV3CompilerMetadata,
} from "./mock/marketplaceV3Metadata";
import {
  directListingsBytecode,
  directListingsCompilerMetadata,
} from "./mock/directListingsMetadata";
import { offersBytecode, offersCompilerMetadata } from "./mock/offersMetadata";
import {
  englishAuctionsBytecode,
  englishAuctionsCompilerMetadata,
} from "./mock/englishAuctionsMetadata";

const itIf = (condition: boolean) => (condition ? it : it.skip);

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

    // IPFS URIs here and below This needs to match the published contract URIs for the contract and extensions
    // the URI can be found by querying the ContractPublisher for those contracts: https://thirdweb.com/polygon/0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7/explorer
    const publishUri = await mockUploadMetadataWithBytecode(
      "MarketplaceV3",
      marketplaceV3CompilerMetadata.output.abi,
      marketplaceV3Bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "autoFactory",
        routerType: "dynamic",
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
      "ipfs://QmYzMgBcabZe9hV2QrC4JMR6f2qmFodiWdtTdqkokvBcYL/0",
    );
    transactionCount = (await sdk.deployer.getTransactionsForDeploy(publishUri))
      .length;

    const address = await sdk.deployer.deployContractFromUri(
      publishUri,
      [
        walletAddress, // defaultAdmin
        "ipfs://QmYzMgBcabZe9hV2QrC4JMR6f2qmFodiWdtTdqkokvBcYL/0", // contractUri
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
      "DirectListingsLogic",
      directListingsCompilerMetadata.output.abi,
      directListingsBytecode,
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
      "ipfs://QmRqErmPh5jpQUEbvKfHx9Wq8FnmjMrokF9x9b8Pw8iGJo/0",
    );

    await mockUploadMetadataWithBytecode(
      "OffersLogic",
      offersCompilerMetadata.output.abi,
      offersBytecode,
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
      "ipfs://QmSmtyccp5pamJB4GzG8ph3p68aheqSyu88tEPx2qD11gY/0",
    );

    await mockUploadMetadataWithBytecode(
      "EnglishAuctionsLogic",
      englishAuctionsCompilerMetadata.output.abi,
      englishAuctionsBytecode,
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
      "ipfs://QmaHC2woTYRbL2tfZujHLt7mDZ5pDJNCCepSGkM5neWYK4/0",
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

  // can only work if secret key is set, skip otherwise
  it("deploy marketplacev3", async () => {
    notificationCounter = 0;
    transactionCount = 0;
    const marketplace = await deployMarketplaceV3();
    expect(notificationCounter).to.greaterThanOrEqual(12);
    expect(transactionCount).to.greaterThanOrEqual(6);

    let extensions = await marketplace.call("getAllExtensions");
    let allExtensions = extensions.map(
      (item: any) => item.metadata.implementation,
    );
    let extensionAddresses = Array.from(new Set(allExtensions));

    expect(extensionAddresses.length).to.equal(3);

    extensionAddresses.forEach(async (address) => {
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

    extensions = await marketplace2.call("getAllExtensions");
    allExtensions = extensions.map((item: any) => item.metadata.implementation);
    extensionAddresses = Array.from(new Set(allExtensions));

    expect(extensionAddresses.length).to.equal(3);

    extensionAddresses.forEach(async (address) => {
      expect(address).to.not.equal(ethers.constants.AddressZero);
      const code = await adminWallet.provider?.getCode(address as string);
      expect(code?.length).to.be.greaterThan(2);
    });
  });
});
