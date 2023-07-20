import {
  NATIVE_TOKEN_ADDRESS,
  Token,
  TokenInitializer,
  SmartContract,
  AirdropERC20Initializer,
} from "../../src/evm";
import { jsonProvider, sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert } from "chai";
import { ethers } from "ethers";

global.fetch = require("cross-fetch");

let tokenAddress = NATIVE_TOKEN_ADDRESS;

/**
 * Throughout these tests, the admin wallet will be the deployer
 * and lister of all listings.
 *
 * Bog and Sam and Abby wallets will be used for direct listings and auctions.
 */
describe("Airdrop ERC20", async () => {
  let airdropContract: SmartContract;
  let customTokenContract: Token;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    w4: SignerWithAddress;

  beforeEach(async () => {
    await jsonProvider.send("hardhat_reset", []);
    [adminWallet, samWallet, bobWallet, , , , , w4] = signers;

    sdk.updateSignerOrProvider(adminWallet);

    airdropContract = await sdk.getContract(
      await sdk.deployer.deployBuiltInContract(
        AirdropERC20Initializer.contractType,
        {
          name: "Test Airdrop ERC20",
        },
      ),
      "airdrop-erc20",
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
  });
});
