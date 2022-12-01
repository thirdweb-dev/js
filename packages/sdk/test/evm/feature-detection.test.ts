import {
  extractMinimalProxyImplementationAddress,
  ThirdwebSDK,
} from "../../src/evm";
import { expectError, signers, sdk } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { ethers } from "ethers";
import invariant from "tiny-invariant";

global.fetch = require("cross-fetch");

describe("Custom Contracts", async () => {
  let nftContractAddress: string;
  let adminWallet: SignerWithAddress;
  let realSDK: ThirdwebSDK;

  before(async () => {
    [adminWallet] = signers;
    realSDK = new ThirdwebSDK(adminWallet);
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    realSDK.updateSignerOrProvider(adminWallet);

    nftContractAddress = await sdk.deployer.deployNFTCollection({
      name: `NFT`,
      description: "Test contract from tests",
      image: "image",
      primary_sale_recipient: adminWallet.address,
      seller_fee_basis_points: 500,
      fee_recipient: adminWallet.address,
      platform_fee_basis_points: 10,
      platform_fee_recipient: adminWallet.address,
    });
  });

  it("should extract implementation address for eip-1167 minimal proxy", async () => {
    // https://eips.ethereum.org/EIPS/eip-1167#specification
    const code =
      "0x363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });

  it("should extract implementation address for minimal proxy with receive", async () => {
    // https://github.com/0xSplits/splits-contracts/blob/c7b741926ec9746182d0d1e2c4c2046102e5d337/contracts/libraries/Clones.sol#L32
    const code =
      "0x36603057343d52307f830d2d700a97af574b186c80d40429385d24241565b08a7c559ba283a964d9b160203da23d3df35b3d3d3d3d363d3d37363d73bebebebebebebebebebebebebebebebebebebebe5af43d3d93803e605b57fd5bf3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });

  it("should extract implementation address for more minimal proxy", async () => {
    // https://medium.com/coinmonks/the-more-minimal-proxy-5756ae08ee48
    const code =
      "0x3d3d3d3d363d3d37363d73bebebebebebebebebebebebebebebebebebebebe5af43d3d93803e602a57fd5bf3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });

  it("should extract implementation address for older vyper (uniswap v1) proxy", async () => {
    const code =
      "0x366000600037611000600036600073bebebebebebebebebebebebebebebebebebebebe5af41558576110006000f3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });
});
