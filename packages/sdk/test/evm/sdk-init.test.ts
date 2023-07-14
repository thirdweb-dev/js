import { ThirdwebSDK } from "../../src/evm";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Goerli, Fncy } from "@thirdweb-dev/chains";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { expect } from "chai";
import { ethers, Signer } from "ethers";
import hardhat from "hardhat";

global.fetch = require("cross-fetch");

class EthersWallet {
  signer: Signer;
  constructor(signer: Signer) {
    this.signer = signer;
  }
  async getSigner() {
    return this.signer;
  }
}

describe("SDK Initialization", async () => {
  let signer: SignerWithAddress;
  let provider: ethers.providers.Provider;

  before(async () => {
    [signer] = await (hardhat as any).ethers.getSigners();
    provider = signer.provider as ethers.providers.Provider;
  });

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

  it("should be able to be initialized with a signer that has a connected provider", async () => {
    const sdk = new ThirdwebSDK(signer);
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(31337);
  });

  it("Should be able to be initialized with just a provider", async () => {
    const sdk = new ThirdwebSDK(provider);
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(31337);
  });

  it("Should throw an error if initialized with an empty signer", async () => {
    const emptySigner = ethers.Wallet.createRandom();
    expect(() => new ThirdwebSDK(emptySigner)).to.throw(
      "No provider passed to the SDK! Please make sure that your signer is connected to a provider!",
    );
  });

  it("Should be able to be initialized with a private key", async () => {
    const privateKey = ethers.Wallet.createRandom().privateKey;
    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "goerli");
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("Should be able to be initialized with a signer", async () => {
    const emptySigner = ethers.Wallet.createRandom();
    const sdk = ThirdwebSDK.fromSigner(emptySigner, "goerli");
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("Should be able to be initialized with a wallet", async () => {
    const emptySigner = ethers.Wallet.createRandom();
    const wallet = new EthersWallet(emptySigner);
    const sdk = await ThirdwebSDK.fromWallet(wallet, "goerli");
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("Should be able to connect directly via http RPC URL", async () => {
    const sdk = new ThirdwebSDK("http://localhost:8545");
    const network = await sdk.getProvider().getNetwork();
    expect([1337, 31337]).to.include(network.chainId);
  });

  it.skip("Should be able to connect directly via websocket RPC URL", async () => {
    // Manually kill this test after it passes, otherwise the websocket connection will stay open
    after(() => {
      process.exit(0);
    });

    const sdk = new ThirdwebSDK("ws://localhost:8545");
    const network = await sdk.getProvider().getNetwork();
    expect([1337, 31337]).to.include(network.chainId);
  });

  it("Should instantiate SDK storage with custom storage instance", async () => {
    const sdk = new ThirdwebSDK(
      "goerli",
      undefined,
      new ThirdwebStorage({ gatewayUrls: ["example.com"] }),
    );
    expect(sdk.storage.getGatewayUrls()["ipfs://"]).to.contain("example.com/");
  });

  it("Should instantiate SDK storage with gatewayUrls", async () => {
    const sdk = new ThirdwebSDK("goerli", { gatewayUrls: ["example.com"] });
    expect(sdk.storage.getGatewayUrls()["ipfs://"]).to.contain("example.com/");
  });
});
