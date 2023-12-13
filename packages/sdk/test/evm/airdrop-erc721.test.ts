import {
  NFTCollection,
  NFTCollectionInitializer,
  SmartContract,
  ThirdwebSDK,
} from "../../src/evm";
import {
  extendedMetadataMock,
  jsonProvider,
  sdk,
  signers,
} from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  AirdropERC721__factory,
  Forwarder__factory,
} from "@thirdweb-dev/contracts-js";
import { expect, assert } from "chai";
import { ethers } from "ethers";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  bytecode as TWCloneFactoryBytecode,
  abi as TWCloneFactoryAbi,
} from "./metadata/TWCloneFactory";

/**
 * Throughout these tests, the admin wallet will be performing the airdrops.
 *
 */
describe("Airdrop ERC721", async () => {
  let airdropContract: SmartContract;
  let dummyNftContract: NFTCollection;
  let dummyNftContractAddress: string;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    randomWallet: SignerWithAddress,
    w4: SignerWithAddress;

  beforeEach(async () => {
    await jsonProvider.send("hardhat_reset", []);
    [adminWallet, samWallet, bobWallet, randomWallet, , , , w4] = signers;

    sdk.updateSignerOrProvider(adminWallet);

    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";
    await mockPublishAirdrop();
    airdropContract = await sdk.getContract(
      await sdk.deployer.deployAirdropERC721({
        name: "Test Airdrop ERC721",
      }),
    );
    process.env.contractPublisherAddress = mockPublisher;

    dummyNftContract = await sdk.getNFTCollection(
      await sdk.deployer.deployBuiltInContract(
        NFTCollectionInitializer.contractType,
        {
          name: "TEST NFT",
          seller_fee_basis_points: 200,
          fee_recipient: adminWallet.address,
          primary_sale_recipient: adminWallet.address,
        },
      ),
    );
    await dummyNftContract.mintBatch([
      {
        name: "Test 0",
      },
      {
        name: "Test 2",
      },
      {
        name: "Test 3",
      },
      {
        name: "Test 4",
      },
    ]);

    await dummyNftContract.setApprovalForAll(
      airdropContract.getAddress(),
      true,
    );

    dummyNftContractAddress = dummyNftContract.getAddress();
  });

  before("Mock upload infra contracts", async () => {
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
  });

  const mockPublishAirdrop = async () => {
    const publishedContract = await new ThirdwebSDK("polygon", {
      secretKey: process.env.TW_SECRET_KEY,
    })
      .getPublisher()
      .getVersion(
        "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
        "AirdropERC721",
        "latest",
      );

    // mock publish as a autoFactory-deploy contract
    await mockUploadMetadataWithBytecode(
      "AirdropERC721",
      AirdropERC721__factory.abi,
      AirdropERC721__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "autoFactory",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
      },
      publishedContract?.metadataUri,
    );
  };

  /**
   * =========== Airdrop Tests ============
   */
  describe("Drop", () => {
    it("check contract", async () => {
      const contractTypeBytes =
        ethers.utils.formatBytes32String("AirdropERC721");
      const contractType = await airdropContract.call("contractType");

      assert(contractType, contractTypeBytes);
    });

    it("should perform airdrop", async () => {
      await airdropContract.airdrop721.drop(
        dummyNftContractAddress,
        adminWallet.address,
        [
          { recipient: samWallet.address, tokenId: 0 },
          { recipient: bobWallet.address, tokenId: 1 },
          { recipient: randomWallet.address, tokenId: 2 },
        ],
      );

      expect(await dummyNftContract.ownerOf(0)).to.equal(samWallet.address);
      expect(await dummyNftContract.ownerOf(1)).to.equal(bobWallet.address);
      expect(await dummyNftContract.ownerOf(2)).to.equal(randomWallet.address);
    });

    it("should correctly return failed airdrop recipients", async () => {
      const randomContractAsRecipient = process.env
        .contractPublisherAddress as string;

      const output = await airdropContract.airdrop721.drop(
        dummyNftContractAddress,
        adminWallet.address,
        [
          { recipient: samWallet.address, tokenId: 0 },
          { recipient: bobWallet.address, tokenId: 1 },
          { recipient: randomWallet.address, tokenId: 2 },
          { recipient: randomContractAsRecipient, tokenId: 3 },
        ],
      );

      expect(await dummyNftContract.ownerOf(0)).to.equal(samWallet.address);
      expect(await dummyNftContract.ownerOf(1)).to.equal(bobWallet.address);
      expect(await dummyNftContract.ownerOf(2)).to.equal(randomWallet.address);

      // check failed
      assert(randomContractAsRecipient === output.failedDrops[0].recipient);
      assert(output.failedDropCount === 1);
      assert(output.successfulDropCount === 3);
    });
  });
});
