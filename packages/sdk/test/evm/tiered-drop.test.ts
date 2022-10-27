import { NATIVE_TOKEN_ADDRESS, ThirdwebSDK } from "../../src/evm";
import { SmartContract } from "../../src/evm/contracts/smart-contract";
import { signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

describe("Tiered Drop Contract", async () => {
  let contract: SmartContract;
  let sdk: ThirdwebSDK;
  let adminWallet: SignerWithAddress;
  let claimerWallet: SignerWithAddress;
  let attackerWallet: SignerWithAddress;

  before(async () => {
    [adminWallet, claimerWallet, attackerWallet] = signers;
    sdk = new ThirdwebSDK(adminWallet);

    // "ipfs://QmPhsvsLDWokxBbKfkd3zq1NCJexdmCdUfLbqRhVWq8JPp/0"
    // This needs to match the release for the currently used ABI
    const releaseUri = "ipfs://QmWeMoptNdtn7vu28cMV7qaCTNrGZdM9X5Y8c3m5LJ9wdJ";
    const address = await sdk.deployer.deployContractFromUri(releaseUri, [], {
      forceDirectDeploy: true,
    });

    contract = await sdk.getContract(address);

    const walletAddress = await sdk.wallet.getAddress();
    await contract.call(
      "initialize",
      walletAddress, // defaultAdmin
      "Tiered Drop #1", // name
      "TD", // symbol
      "ipfs://QmUj5kNz7Xe5AEhV2YvHiCKfMSL5YZpD4E18QLLYEsGBcd/0", // contractUri
      [], // trustedForwarders
      walletAddress, // saleRecipient
      walletAddress, // royaltyRecipient
      0, // royaltyBps
    );
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
    const txs = await contract.erc721.tieredDrop.lazyMintWithTier(
      metadata,
      "tier1",
    );
    expect(txs.length).to.equal(2);

    const nfts = await contract.erc721.tieredDrop.getMetadataInTier("tier1");
    expect(nfts.length).to.equal(2);
    expect(nfts[0].name).to.equal("NFT #1");
  });

  it("Should reject invalid payload", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const payload = {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      metadata: {
        name: "OUCH VOUCH",
      },
      price: 0,
      quantity: 1,
      tierPriority: ["tier1"],
      to: claimerWallet.address,
      mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
      mintStartTime: new Date(),
    };
    const signedPayload = await contract.erc721.tieredDrop.generate(payload);

    sdk.updateSignerOrProvider(attackerWallet);
    try {
      await contract.erc721.tieredDrop.claimWithSignature(signedPayload);
      expect.fail();
    } catch (err) {
      // TODO: Check error message
    }
  });

  it("Should claim NFTs", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const payload = {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      metadata: {
        name: "OUCH VOUCH",
      },
      price: 0,
      quantity: 1,
      tierPriority: ["tier1"],
      to: claimerWallet.address,
      mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
      mintStartTime: new Date(Date.now() - 1000),
    };
    const signedPayload = await contract.erc721.tieredDrop.generate(payload);
    const isValid = await contract.erc721.tieredDrop.verify(signedPayload);

    // eslint-disable-next-line no-unused-expressions
    expect(isValid).to.be.true;

    sdk.updateSignerOrProvider(claimerWallet);
    await contract.erc721.tieredDrop.claimWithSignature(signedPayload);
  });
});
