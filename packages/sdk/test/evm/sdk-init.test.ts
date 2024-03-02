import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Fncy, Goerli } from "@thirdweb-dev/chains";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { expect } from "chai";
import { Signer, ethers } from "ethers";
import hardhat from "hardhat";
import { ThirdwebSDK } from "../../src/evm";

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
    const sdk = new ThirdwebSDK(5, { secretKey: process.env.TW_SECRET_KEY });
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("should be able to be initialized with a chain name", async () => {
    const sdk = new ThirdwebSDK("goerli", {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("should be able to be initialized with a default chain", async () => {
    const sdk = new ThirdwebSDK(Goerli, {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("should be able to be initialized with a custom chain", async () => {
    const sdk = new ThirdwebSDK(Fncy, { secretKey: process.env.TW_SECRET_KEY });
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(Fncy.chainId);
  });

  it("should be able to be initialized with a signer that has a connected provider", async () => {
    const sdk = new ThirdwebSDK(signer, {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(31337);
  });

  it("Should be able to be initialized with just a provider", async () => {
    const sdk = new ThirdwebSDK(provider, {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(31337);
  });

  it("Should throw an error if initialized with an empty signer", async () => {
    const emptySigner = ethers.Wallet.createRandom();
    expect(
      () =>
        new ThirdwebSDK(emptySigner, { secretKey: process.env.TW_SECRET_KEY }),
    ).to.throw(
      "No provider passed to the SDK! Please make sure that your signer is connected to a provider!",
    );
  });

  it("Should be able to be initialized with a private key", async () => {
    const privateKey = ethers.Wallet.createRandom().privateKey;
    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "goerli", {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("Should be able to be initialized with a signer", async () => {
    const emptySigner = ethers.Wallet.createRandom();
    const sdk = ThirdwebSDK.fromSigner(emptySigner, "goerli", {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it("Should be able to be initialized with a wallet", async () => {
    const emptySigner = ethers.Wallet.createRandom();
    const wallet = new EthersWallet(emptySigner);
    const sdk = await ThirdwebSDK.fromWallet(wallet, "goerli", {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const network = await sdk.getProvider().getNetwork();
    expect(network.chainId).to.equal(5);
  });

  it.skip("Should be able to connect directly via http RPC URL", async () => {
    const sdk = new ThirdwebSDK("http://localhost:8545", {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const network = await sdk.getProvider().getNetwork();
    expect([1337, 31337]).to.include(network.chainId);
  });

  it.skip("Should be able to connect directly via websocket RPC URL", async () => {
    // Manually kill this test after it passes, otherwise the websocket connection will stay open
    after(() => {
      process.exit(0);
    });

    const sdk = new ThirdwebSDK("ws://localhost:8545", {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const network = await sdk.getProvider().getNetwork();
    expect([1337, 31337]).to.include(network.chainId);
  });

  it("Should instantiate SDK storage with custom storage instance", async () => {
    const sdk = new ThirdwebSDK(
      "goerli",
      { secretKey: process.env.TW_SECRET_KEY },
      new ThirdwebStorage({
        gatewayUrls: ["example.com"],
        secretKey: process.env.TW_SECRET_KEY,
      }),
    );
    expect(sdk.storage.getGatewayUrls()["ipfs://"]).to.contain("example.com");
  });

  it("Should instantiate SDK storage with gatewayUrls", async () => {
    const sdk = new ThirdwebSDK("goerli", {
      secretKey: process.env.TW_SECRET_KEY,
      gatewayUrls: ["example.com"],
    });
    expect(sdk.storage.getGatewayUrls()["ipfs://"]).to.contain("example.com");
  });
});
