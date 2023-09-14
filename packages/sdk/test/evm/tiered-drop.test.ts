import { NATIVE_TOKEN_ADDRESS, ThirdwebSDK } from "../../src/evm";
import { SmartContract } from "../../src/evm/contracts/smart-contract";
import { signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";

// TODO mock upload metadata to deploy this contract isntead of relying on IPFS
describe("Tiered Drop Contract", async () => {
  let contract: SmartContract;
  let sdk: ThirdwebSDK;
  let adminWallet: SignerWithAddress;
  let claimerWallet: SignerWithAddress;

  async function deployTieredDrop() {
    // This needs to match the published contract for the currently used ABI
    const publishUri =
      "ipfs://QmXu9ezFNgXBX1juLZ7kwdf5KpTD1x9GPHnk14QB2NpUvK/0";
    const address = await sdk.deployer.deployContractFromUri(publishUri, [], {
      forceDirectDeploy: true,
    });

    const tieredDrop = await sdk.getContract(address);

    const walletAddress = await sdk.wallet.getAddress();
    await tieredDrop.call("initialize", [
      walletAddress, // defaultAdmin
      "Tiered Drop #1", // name
      "TD", // symbol
      "ipfs://QmUj5kNz7Xe5AEhV2YvHiCKfMSL5YZpD4E18QLLYEsGBcd/0", // contractUri
      [], // trustedForwarders
      walletAddress, // saleRecipient
      walletAddress, // royaltyRecipient
      0, // royaltyBps
    ]);

    return tieredDrop;
  }

  before(async () => {
    [adminWallet, claimerWallet] = signers;
    sdk = new ThirdwebSDK(adminWallet, {
      secretKey: process.env.TW_SECRET_KEY,
    });

    contract = await deployTieredDrop();
  });

  beforeEach(() => {
    sdk.updateSignerOrProvider(adminWallet);
  });

  it("Should lazy mint NFTs", async () => {
    const metadata = [
      {
        name: "NFT #1",
        description: "My first NFT",
      },
      {
        name: "NFT #2",
        description: "My second NFT",
      },
    ];
    const txs = await contract.erc721.tieredDrop.createBatchWithTier(
      metadata,
      "tier1",
    );
    expect(txs.length).to.equal(2);

    const nfts = await contract.erc721.tieredDrop.getMetadataInTier("tier1");
    expect(nfts.length).to.equal(2);
    expect(nfts[0].name).to.equal("NFT #1");
  });

  it("Should reject invalid payload", async () => {
    const payload = {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      price: 0,
      quantity: 1,
      tierPriority: ["tier1"],
      to: claimerWallet.address,
      mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
      mintStartTime: new Date(),
    };
    const signedPayload = await contract.erc721.tieredDrop.generate(payload);
    signedPayload.payload.price = "1";

    sdk.updateSignerOrProvider(claimerWallet);
    const isValid = await contract.erc721.tieredDrop.verify(signedPayload);
    assert.isFalse(isValid);
  });

  it("Should claim NFTs", async () => {
    const payload = {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      price: 0,
      quantity: 1,
      tierPriority: ["tier1"],
      to: claimerWallet.address,
      mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
      mintStartTime: new Date(Date.now() - 1000),
    };
    const signedPayload = await contract.erc721.tieredDrop.generate(payload);
    const isValid = await contract.erc721.tieredDrop.verify(signedPayload);

    assert.isTrue(isValid);

    sdk.updateSignerOrProvider(claimerWallet);
    const txs = await contract.erc721.tieredDrop.claimWithSignature(
      signedPayload,
    );
    expect((await txs[0].data()).metadata.name).to.equal("NFT #1");
  });

  it("Should get tokens in tier", async () => {
    const payload = {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      price: 0,
      quantity: 1,
      tierPriority: ["tier1"],
      to: claimerWallet.address,
      mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
      mintStartTime: new Date(Date.now() - 1000),
    };
    const signedPayload = await contract.erc721.tieredDrop.generate(payload);
    await contract.erc721.tieredDrop.claimWithSignature(signedPayload);

    const nfts = await contract.erc721.tieredDrop.getTokensInTier("tier1");
    expect(nfts.length).to.equal(2);
    expect(nfts[0].metadata.name).to.equal("NFT #1");
    expect(nfts[1].metadata.name).to.equal("NFT #2");
  });

  it("Should claim from multiple tiers", async () => {
    let metadata = [
      {
        name: "NFT #3",
        description: "My first NFT",
      },
    ];
    await contract.erc721.tieredDrop.createBatchWithTier(metadata, "tier1");

    metadata = [
      {
        name: "NFT #4",
        description: "My fourth NFT",
      },
    ];
    await contract.erc721.tieredDrop.createBatchWithTier(metadata, "tier2");

    metadata = [
      {
        name: "NFT #5",
        description: "My fifth NFT",
      },
    ];
    await contract.erc721.tieredDrop.createBatchWithTier(metadata, "tier3");

    const payload = {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      price: 0,
      quantity: 3,
      tierPriority: ["tier1", "tier2", "tier3"],
      to: claimerWallet.address,
      mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
      mintStartTime: new Date(Date.now() - 1000),
    };
    const signedPayload = await contract.erc721.tieredDrop.generate(payload);
    await contract.erc721.tieredDrop.claimWithSignature(signedPayload);

    let nfts = await contract.erc721.tieredDrop.getTokensInTier("tier1");
    expect(nfts.length).to.equal(3);
    expect(nfts[2].metadata.name).to.equal("NFT #3");

    nfts = await contract.erc721.tieredDrop.getTokensInTier("tier2");
    expect(nfts.length).to.equal(1);
    expect(nfts[0].metadata.name).to.equal("NFT #4");

    nfts = await contract.erc721.tieredDrop.getTokensInTier("tier3");
    expect(nfts.length).to.equal(1);
    expect(nfts[0].metadata.name).to.equal("NFT #5");
  });

  it.skip("metadata should reveal correctly", async () => {
    contract = await deployTieredDrop();

    const placeholder = {
      name: "Placeholder",
      description: "This is a placeholder",
    };
    const metadata = [
      {
        name: "NFT #1",
        description: "My first NFT",
      },
      {
        name: "NFT #2",
        description: "My second NFT",
      },
    ];
    await contract.erc721.tieredDrop.createDelayedRevealBatchWithTier(
      placeholder,
      metadata,
      "my secret password",
      "tier1",
    );

    let nfts = await contract.erc721.tieredDrop.getMetadataInTier("tier1");
    expect(nfts.length).to.equal(2);
    expect(nfts[0].name).to.equal("Placeholder");

    await contract.erc721.tieredDrop.reveal(0, "my secret password");

    nfts = await contract.erc721.tieredDrop.getMetadataInTier("tier1");
    expect(nfts.length).to.equal(2);
    expect(nfts[0].name).to.equal("NFT #1");
  });
});
