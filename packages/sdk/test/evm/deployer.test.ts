import {
  NATIVE_TOKEN_ADDRESS,
  PayloadToSign20,
  SignedPayload721WithQuantitySignature,
  ThirdwebSDK,
} from "../../src/evm";
import { expectError, signers, sdk } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  TokenERC20__factory,
  TokenERC721__factory,
  VoteERC20__factory,
} from "@thirdweb-dev/contracts-js";
import { assert, expect } from "chai";
import { ethers } from "ethers";
import invariant from "tiny-invariant";

global.fetch = require("cross-fetch");

describe("Custom Contracts", async () => {
  let customContractAddress: string;
  let nftContractAddress: string;
  let tokenContractAddress: string;
  let editionContractAddress: string;
  let editionDropContractAddress: string;
  let tokenDropContractAddress: string;
  let sigDropContractAddress: string;
  let nftDropContractAddress: string;
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;
  let realSDK: ThirdwebSDK;
  let simpleContractUri: string;

  before(async () => {
    [adminWallet, samWallet, bobWallet] = signers;
    realSDK = new ThirdwebSDK(adminWallet);
    simpleContractUri =
      "ipfs://QmNPcYsXDAZvQZXCG73WSjdiwffZkNkoJYwrDDtcgM142A/0";
    // if we update the test data - await uploadContractMetadata("Greeter", storage);

    // only create this once by default (hits IPFS!)
    customContractAddress = await realSDK.deployer.deployContractFromUri(
      simpleContractUri,
      [],
    );
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    realSDK.updateSignerOrProvider(adminWallet);

    tokenContractAddress = await sdk.deployer.deployToken({
      name: `Token`,
      description: "Test contract from tests",
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
      primary_sale_recipient: samWallet.address,
      platform_fee_basis_points: 10,
      platform_fee_recipient: adminWallet.address,
    });
  });

  it("should verify module type and version of deployed contract", async () => {
    const c = await realSDK.getContract(tokenContractAddress);
    invariant(c, "Contract undefined");
    expect(await c.call("contractType")).to.eq(
      ethers.utils.formatBytes32String("TokenERC20"),
    );
  });
});
