import {
  NATIVE_TOKEN_ADDRESS,
  Token,
  TokenInitializer,
  SmartContract,
} from "../../src/evm";
import { jsonProvider, sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { BigNumber, ethers } from "ethers";

global.fetch = require("cross-fetch");

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

    airdropContract = await sdk.getContract(
      await sdk.deployer.deployAirdropERC20({
        name: "Test Airdrop ERC20",
      }),
    );

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
