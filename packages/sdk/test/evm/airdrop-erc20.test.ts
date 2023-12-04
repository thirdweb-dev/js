import {
  NATIVE_TOKEN_ADDRESS,
  Token,
  TokenInitializer,
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
  AirdropERC20__factory,
  Forwarder__factory,
} from "@thirdweb-dev/contracts-js";
import { expect, assert } from "chai";
import { BigNumber, ethers } from "ethers";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  bytecode as TWCloneFactoryBytecode,
  abi as TWCloneFactoryAbi,
} from "./metadata/TWCloneFactory";

let tokenAddress = NATIVE_TOKEN_ADDRESS;

/**
 * Throughout these tests, the admin wallet will be performing the airdrops.
 *
 */
describe("Airdrop ERC20", async () => {
  let airdropContract: SmartContract;
  let customTokenContract: Token;

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
      await sdk.deployer.deployAirdropERC20({
        name: "Test Airdrop ERC20",
      }),
    );
    process.env.contractPublisherAddress = mockPublisher;

    customTokenContract = await sdk.getToken(
      await sdk.deployer.deployBuiltInContract(TokenInitializer.contractType, {
        name: "Test",
        symbol: "TEST",
        primary_sale_recipient: adminWallet.address,
      }),
    );
    await customTokenContract.mintBatchTo([
      {
        toAddress: adminWallet.address,
        amount: 1000,
      },
    ]);
    tokenAddress = customTokenContract.getAddress();

    await customTokenContract.setAllowance(airdropContract.getAddress(), 1000);
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
        "AirdropERC20",
        "latest",
      );

    // mock publish as a autoFactory-deploy contract
    await mockUploadMetadataWithBytecode(
      "AirdropERC20",
      AirdropERC20__factory.abi,
      AirdropERC20__factory.bytecode,
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
        ethers.utils.formatBytes32String("AirdropERC20");
      const contractType = await airdropContract.call("contractType");

      assert(contractType, contractTypeBytes);
    });

    it("should perform airdrop", async () => {
      await airdropContract.airdrop20.drop(tokenAddress, adminWallet.address, [
        { recipient: samWallet.address, amount: 10 },
        { recipient: bobWallet.address, amount: 15 },
        { recipient: randomWallet.address, amount: 20 },
      ]);

      const samBalance = (
        await customTokenContract.balanceOf(samWallet.address)
      ).value;
      const bobBalance = (
        await customTokenContract.balanceOf(bobWallet.address)
      ).value;
      const randomBalance = (
        await customTokenContract.balanceOf(randomWallet.address)
      ).value;
      const adminBalance = (
        await customTokenContract.balanceOf(adminWallet.address)
      ).value;

      expect(samBalance.toNumber()).to.equal(10);
      expect(bobBalance.toNumber()).to.equal(15);
      expect(randomBalance.toNumber()).to.equal(20);

      expect(adminBalance.toString()).to.equal(
        BigNumber.from(ethers.utils.parseEther("1000"))
          .sub(samBalance.toString())
          .sub(bobBalance.toString())
          .sub(randomBalance.toString())
          .toString(),
      );
    });
  });
});
