import {
  NFTCollection,
  NFTCollectionInitializer,
  SmartContract,
} from "../../src/evm";
import { jsonProvider, sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ethers } from "ethers";

global.fetch = require("cross-fetch");

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

    airdropContract = await sdk.getContract(
      await sdk.deployer.deployAirdropERC721({
        name: "Test Airdrop ERC721",
      }),
    );

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
  });
});
