import {
  Forwarder__factory,
  OpenEditionERC721__factory,
} from "@thirdweb-dev/contracts-js";
import { SmartContract } from "../../src/evm/contracts/smart-contract";
import {
  expectError,
  extendedMetadataMock,
  jsonProvider,
  sdk,
  signers,
  thirdwebFactory,
} from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  bytecode as TWCloneFactoryBytecode,
  abi as TWCloneFactoryAbi,
} from "./metadata/TWCloneFactory";
import { AbiSchema, isFeatureEnabled } from "../../src/evm";

describe("ERC721A Queryable NFT Contract", async () => {
  let contract: SmartContract;
  let openEditionPublishUri: string;

  let adminWallet: SignerWithAddress;
  let samWallet: SignerWithAddress;

  async function deployOpenEdition() {
    const adminAddress = adminWallet.address;

    // do an old-factory deploy for now
    // TODO: change it to autoFactory once it gets published with Thirdweb Deployer wallet

    // Deploy proxy OpenEditionERC721
    const contractAddress = await sdk.deployer.deployContractFromUri(
      openEditionPublishUri,
      [
        adminAddress, // defaultAdmin
        "Open Edition", // name
        "OE721", // symbol
        "", // contractUri
        [], // trustedForwarders
        adminAddress, // saleRecipient
        adminAddress, // royaltyRecipient
        0, // royaltyBps
      ],
    );

    const openEdition = await sdk.getContract(contractAddress);

    return openEdition;
  }

  before("Mock upload infra contracts", async () => {
    [adminWallet, samWallet] = signers;
    // mock upload Forwarder
    await mockUploadMetadataWithBytecode(
      "Forwarder",
      Forwarder__factory.abi,
      Forwarder__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
      },
      "ipfs://Qmcu8FaqerUvQYb4qPg7PwkXa6dRtEe45LedLJPN42Jwqe/0",
      // ^ we use actual publish uri as mock uri here, because this contract's uri is fetched from publisher by contractName
    );

    // mock upload TWCloneFactory
    await mockUploadMetadataWithBytecode(
      "Forwarder",
      TWCloneFactoryAbi,
      TWCloneFactoryBytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
      },
      "ipfs://QmYfw13Zykqf9jAmJobNgYrEpatEF9waWcQPUHvJ7sctRb/0",
      // ^ we use actual publish uri as mock uri here, because this contract's uri is fetched from publisher by contractName
    );

    // mock publish as a autoFactory-deploy contract
    // openEditionPublishUri = await mockUploadMetadataWithBytecode(
    //   "OpenEditionERC721",
    //   OpenEditionERC721__factory.abi,
    //   OpenEditionERC721__factory.bytecode,
    //   "",
    //   {
    //     ...extendedMetadataMock,
    //     deployType: "autoFactory",
    //     networksForDeployment: {
    //       allNetworks: true,
    //       networksEnabled: [],
    //     },
    //     publisher: adminWallet.address,
    //   },
    // );

    const implementationAddress = await sdk.deployer.deployContractWithAbi(
      OpenEditionERC721__factory.abi,
      OpenEditionERC721__factory.bytecode,
      [],
    );

    await (
      await thirdwebFactory.approveImplementation(implementationAddress, true)
    ).wait();

    // re-upload, with implementation address
    openEditionPublishUri = await mockUploadMetadataWithBytecode(
      "OpenEditionERC721",
      OpenEditionERC721__factory.abi,
      OpenEditionERC721__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        isDeployableViaFactory: true,
        factoryDeploymentData: {
          ...extendedMetadataMock?.factoryDeploymentData,
          implementationAddresses: {
            "31337": implementationAddress,
          },
          factoryAddresses: {
            "31337": process.env.factoryAddress,
          },
        },
        publisher: adminWallet.address,
      },
    );
  });

  beforeEach(async () => {
    await jsonProvider.send("hardhat_reset", []);
    sdk.updateSignerOrProvider(adminWallet);

    // const mockPublisher = process.env.contractPublisherAddress;
    // process.env.contractPublisherAddress =
    //   "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    contract = await deployOpenEdition();
    // process.env.contractPublisherAddress = mockPublisher;
  });

  it("should detect queryable", async () => {
    assert(isFeatureEnabled(AbiSchema.parse(contract.abi), "ERC721AQueryable"));
  });

  it("claim", async () => {
    // claiming with default conditions
    await contract.erc721.claimConditions.set([{}]);
    await contract.erc721.claim(1);
    // claiming with max supply
    await contract.erc721.claimConditions.set([
      {
        maxClaimableSupply: 2,
      },
    ]);
    try {
      await contract.erc721.claim(2);
      expect.fail("should not be able to claim 2 - maxSupply");
    } catch (e) {
      expectError(e, "!MaxSupply");
    }
    await contract.erc721.claim(1);
    // claiming with max per wallet
    await contract.erc721.claimConditions.set(
      [
        {
          maxClaimablePerWallet: 1,
        },
      ],
      true,
    );
    try {
      await contract.erc721.claim(2);
      expect.fail("should not be able to claim 2 - maxClaimablePerWallet");
    } catch (e) {
      expectError(e, "!Qty");
    }
    await contract.erc721.claim(1);
    expect((await contract.erc721.totalClaimedSupply()).toString()).eq("3");
  });

  it("get owned", async () => {
    // claiming with default conditions
    await contract.erc721.claimConditions.set([{}]);

    const numClaimers = 3;
    const tokensPerClaimer = 10;
    const numTokens = numClaimers * tokensPerClaimer;

    const claimers = signers.slice(0, numClaimers).map((i) => i.address);

    // mint tokens to addresses in claimers array
    for (let i = 0; i < numTokens; i++) {
      const index = i % numClaimers;
      await contract.erc721.claimTo(claimers[index], 1);
    }

    // check ownership
    for (let i = 0; i < numClaimers; i++) {
      const ownedTokens = await contract.erc721.getOwned(claimers[i]);
      assert(ownedTokens.length === tokensPerClaimer);

      for (let j = 0; j < tokensPerClaimer; j++) {
        const tokenId = ownedTokens[j].metadata.id;
        assert(tokenId === (j * numClaimers + i + 1).toString());
      }
    }
  });
});
