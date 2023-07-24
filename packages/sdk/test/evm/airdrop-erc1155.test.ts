import {
  Edition,
  EditionInitializer,
  SmartContract,
  AirdropERC1155Initializer,
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

    airdropContract = await sdk.getContract(
      await sdk.deployer.deployBuiltInContract(
        AirdropERC1155Initializer.contractType,
        {
          name: "Test Airdrop ERC1155",
        },
      ),
      "airdrop-erc1155",
    );

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
  });
});
