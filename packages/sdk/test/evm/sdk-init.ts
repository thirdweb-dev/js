import { ThirdwebSDK } from "../../src/evm";
import { Goerli, Fncy } from "@thirdweb-dev/chains";
// import { signers, storage } from "./before-setup";
// import { AddressZero } from "@ethersproject/constants";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

global.fetch = require("cross-fetch");

describe("SDK Initialization", async () => {
  // let adminWallet: SignerWithAddress, samWallet: SignerWithAddress;

  // before(() => {
  //   [adminWallet, samWallet] = signers;
  // });

  beforeEach(async () => {});

  it("should be able to be initialized with a chainId", async () => {
    const sdk = new ThirdwebSDK(5);
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("should be able to be initialized with a chain name", async () => {
    const sdk = new ThirdwebSDK("goerli");
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("should be able to be initialized with a default chain", async () => {
    const sdk = new ThirdwebSDK(Goerli);
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("should be able to be initialized with a custom chain", async () => {
    const sdk = new ThirdwebSDK(Fncy);
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(Fncy.chainId);
  });
});
