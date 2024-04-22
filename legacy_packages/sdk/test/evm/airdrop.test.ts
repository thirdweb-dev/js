import {
  Edition,
  EditionInitializer,
  NATIVE_TOKEN_ADDRESS,
  NFTCollection,
  NFTCollectionInitializer,
  SmartContract,
  Token,
  TokenInitializer,
} from "../../src/evm";
import { jsonProvider, sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Airdrop__factory } from "@thirdweb-dev/contracts-js";
import { expect } from "chai";
import { deployContractAndUploadMetadata } from "./utils";
import { BigNumber, utils } from "ethers";

let tokenAddress = NATIVE_TOKEN_ADDRESS;

/**
 * Throughout these tests, the admin wallet will be performing the airdrops.
 *
 */
describe("Airdrop ERC721", async () => {
  let airdropContract: SmartContract;
  let customTokenContract: Token;
  let dummyNftContract: NFTCollection;
  let dummyNftContractAddress: string;
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

    const implementation = await deployContractAndUploadMetadata(
      Airdrop__factory.abi,
      Airdrop__factory.bytecode,
      adminWallet,
    );
    const airdropContractAddress = await sdk.deployer.deployProxy(
      implementation,
      Airdrop__factory.abi,
      "initialize",
      [adminWallet.address],
    );
    airdropContract = await sdk.getContract(airdropContractAddress);

    // Dummy ERC721 contract
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

    // Dummy ERC20 contract
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

    // Dummy ERC1155 contract
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

  /**
   * =========== Airdrop Tests ============
   */
  describe("Drop", () => {
    it("should perform airdrop of ERC20 tokens", async () => {
      await airdropContract.airdrop.dropERC20(tokenAddress, [
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
        BigNumber.from(utils.parseEther("1000"))
          .sub(samBalance.toString())
          .sub(bobBalance.toString())
          .sub(randomBalance.toString())
          .toString(),
      );
    });

    it("should perform airdrop of ERC20 tokens with signature", async () => {
      const contents = [
        { recipient: samWallet.address, amount: "10" },
        { recipient: bobWallet.address, amount: "15" },
        { recipient: randomWallet.address, amount: "20" },
      ];

      const signedPayload = await airdropContract.airdrop.generateSignature20({
        tokenAddress,
        contents,
      });

      await airdropContract.airdrop.dropWithSignatureERC20(signedPayload);

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
        BigNumber.from(utils.parseEther("1000"))
          .sub(samBalance.toString())
          .sub(bobBalance.toString())
          .sub(randomBalance.toString())
          .toString(),
      );
    });

    it("should perform airdrop of ERC721 tokens", async () => {
      await airdropContract.airdrop.dropERC721(dummyNftContractAddress, [
        { recipient: samWallet.address, tokenId: 0 },
        { recipient: bobWallet.address, tokenId: 1 },
        { recipient: randomWallet.address, tokenId: 2 },
      ]);

      expect(await dummyNftContract.ownerOf(0)).to.equal(samWallet.address);
      expect(await dummyNftContract.ownerOf(1)).to.equal(bobWallet.address);
      expect(await dummyNftContract.ownerOf(2)).to.equal(randomWallet.address);
    });

    it("should perform airdrop of ERC721 tokens with signature", async () => {
      const contents = [
        { recipient: samWallet.address, tokenId: 0 },
        { recipient: bobWallet.address, tokenId: 1 },
        { recipient: randomWallet.address, tokenId: 2 },
      ];

      const signedPayload = await airdropContract.airdrop.generateSignature721({
        tokenAddress: dummyNftContractAddress,
        contents,
      });

      await airdropContract.airdrop.dropWithSignatureERC721(signedPayload);

      expect(await dummyNftContract.ownerOf(0)).to.equal(samWallet.address);
      expect(await dummyNftContract.ownerOf(1)).to.equal(bobWallet.address);
      expect(await dummyNftContract.ownerOf(2)).to.equal(randomWallet.address);
    });

    it("should perform airdrop of ERC1155 tokens", async () => {
      await airdropContract.airdrop.dropERC1155(dummyBundleContractAddress, [
        { recipient: samWallet.address, tokenId: 0, amount: 10 },
        { recipient: bobWallet.address, tokenId: 0, amount: 12 },
        { recipient: randomWallet.address, tokenId: 1, amount: 5 },
      ]);

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

    it("should perform airdrop of ERC1155 tokens with signature", async () => {
      const contents = [
        { recipient: samWallet.address, tokenId: 0, amount: 10 },
        { recipient: bobWallet.address, tokenId: 0, amount: 12 },
        { recipient: randomWallet.address, tokenId: 1, amount: 5 },
      ];

      const signedPayload = await airdropContract.airdrop.generateSignature1155(
        { tokenAddress: dummyBundleContractAddress, contents },
      );
      await airdropContract.airdrop.dropWithSignatureERC1155(signedPayload);

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
  });
});
