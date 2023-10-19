import {
  Edition,
  EditionInitializer,
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
import { expect, assert } from "chai";
import { ethers } from "ethers";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  bytecode as TWCloneFactoryBytecode,
  abi as TWCloneFactoryAbi,
} from "./metadata/TWCloneFactory";
import {
  AirdropERC1155__factory,
  Forwarder__factory,
} from "@thirdweb-dev/contracts-js";

/**
 * Throughout these tests, the admin wallet will be performing the airdrops.
 *
 */
describe("Airdrop ERC1155", async () => {
  let airdropContract: SmartContract;
  let dummyBundleContract: Edition;
  let dummyBundleContractAddress: string;

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
      "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    await mockPublishAirdrop();
    airdropContract = await sdk.getContract(
      await sdk.deployer.deployAirdropERC1155({
        name: "Test Airdrop ERC1155",
      }),
    );
    process.env.contractPublisherAddress = mockPublisher;

    dummyBundleContract = await sdk.getEdition(
      await sdk.deployer.deployBuiltInContract(
        EditionInitializer.contractType,
        {
          name: "TEST BUNDLE",
          seller_fee_basis_points: 100,
          primary_sale_recipient: adminWallet.address,
        },
      ),
    );
    await dummyBundleContract.mintBatch([
      {
        metadata: {
          name: "Test 0",
        },
        supply: 100000,
      },
      {
        metadata: {
          name: "Test 1",
        },
        supply: 100000,
      },
    ]);

    await dummyBundleContract.setApprovalForAll(
      airdropContract.getAddress(),
      true,
    );

    dummyBundleContractAddress = dummyBundleContract.getAddress();
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
        "AirdropERC1155",
        "latest",
      );

    // mock publish as a autoFactory-deploy contract
    await mockUploadMetadataWithBytecode(
      "AirdropERC1155",
      AirdropERC1155__factory.abi,
      AirdropERC1155__factory.bytecode,
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
        ethers.utils.formatBytes32String("AirdropERC1155");
      const contractType = await airdropContract.call("contractType");

      assert(contractType, contractTypeBytes);
    });

    it("should perform airdrop", async () => {
      await airdropContract.airdrop1155.drop(
        dummyBundleContractAddress,
        adminWallet.address,
        [
          { recipient: samWallet.address, tokenId: 0, amount: 10 },
          { recipient: bobWallet.address, tokenId: 0, amount: 12 },
          { recipient: randomWallet.address, tokenId: 1, amount: 5 },
        ],
      );

      expect(
        (await dummyBundleContract.balanceOf(samWallet.address, 0)).toNumber(),
      ).to.equal(10);
      expect(
        (await dummyBundleContract.balanceOf(bobWallet.address, 0)).toNumber(),
      ).to.equal(12);
      expect(
        (
          await dummyBundleContract.balanceOf(randomWallet.address, 1)
        ).toNumber(),
      ).to.equal(5);
    });

    it("should correctly return failed airdrop recipients", async () => {
      const randomContractAsRecipient = process.env
        .contractPublisherAddress as string;

      const output = await airdropContract.airdrop1155.drop(
        dummyBundleContractAddress,
        adminWallet.address,
        [
          { recipient: samWallet.address, tokenId: 0, amount: 10 },
          { recipient: bobWallet.address, tokenId: 0, amount: 12 },
          { recipient: randomWallet.address, tokenId: 1, amount: 5 },
          { recipient: randomContractAsRecipient, tokenId: 1, amount: 1 },
        ],
      );

      expect(
        (await dummyBundleContract.balanceOf(samWallet.address, 0)).toNumber(),
      ).to.equal(10);
      expect(
        (await dummyBundleContract.balanceOf(bobWallet.address, 0)).toNumber(),
      ).to.equal(12);
      expect(
        (
          await dummyBundleContract.balanceOf(randomWallet.address, 1)
        ).toNumber(),
      ).to.equal(5);

      // check failed
      assert(randomContractAsRecipient === output.failedDrops[0].recipient);
      assert(output.failedDropCount === 1);
      assert(output.successfulDropCount === 3);
    });
  });
});
