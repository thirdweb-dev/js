import { ThirdwebSDK } from "../../src/evm";
import { expectError, sdk } from "./before-setup";
import { expect } from "chai";
import { Wallet } from "ethers";
import { MockStorage } from "./mock/MockStorage";

describe("Error Handling", async () => {
  it("should throw proper error on account with no balance", async () => {
    const newSdk = ThirdwebSDK.fromSigner(
      Wallet.createRandom().connect(sdk.getProvider()),
      undefined,
      { secretKey: process.env.TW_SECRET_KEY },
      MockStorage(),
    );

    try {
      await newSdk.deployer.deployNFTCollection({
        name: "Should Fail Collection",
        primary_sale_recipient: "0x0000000000000000000000000000000000000000",
      });
      expect.fail();
    } catch (err) {
      expectError(err, "sender doesn't have enough funds to send tx");
    }
  });

  it("should throw !BALNFT revert message without gas limit", async () => {
    const collectionAddress = await sdk.deployer.deployNFTCollection({
      name: "Test Collection",
      primary_sale_recipient: "0x0000000000000000000000000000000000000000",
    });
    const marketplaceAddress = await sdk.deployer.deployMarketplace({
      name: "Test Marketplace",
    });

    const collection = await sdk.getContract(collectionAddress);
    await collection.erc721.mintTo(marketplaceAddress, { name: "Test NFT" });

    const marketplace = await sdk.getContract(marketplaceAddress);
    try {
      await marketplace.call("createListing", [
        {
          assetContract: collectionAddress,
          tokenId: 0,
          startTime: 1000000000000,
          secondsUntilEndTime: 10000000000000,
          quantityToList: 1,
          currencyToAccept: "0x0000000000000000000000000000000000000000",
          reservePricePerToken: 0,
          buyoutPricePerToken: 0,
          listingType: 0,
        },
      ]);
      expect.fail();
    } catch (err) {
      // In this case, call static should go through before sendTransaction
      // so there should be no tx hash on the error
      expectError(err, "!BALNFT");
      // eslint-disable-next-line no-unused-expressions
      expect(err.info.hash).to.be.undefined;
    }
  });

  // Here we hit a different code path by passing gas limit, send transaction should go through
  it("should throw !BALNFT revert message without gas limit", async () => {
    const collectionAddress = await sdk.deployer.deployNFTCollection({
      name: "Test Collection",
      primary_sale_recipient: "0x0000000000000000000000000000000000000000",
    });
    const marketplaceAddress = await sdk.deployer.deployMarketplace({
      name: "Test Marketplace",
    });

    const collection = await sdk.getContract(collectionAddress);
    await collection.erc721.mintTo(marketplaceAddress, { name: "Test NFT" });

    const marketplace = await sdk.getContract(marketplaceAddress);
    try {
      await marketplace.call(
        "createListing",
        [
          {
            assetContract: collectionAddress,
            tokenId: 0,
            startTime: 1000000000000,
            secondsUntilEndTime: 10000000000000,
            quantityToList: 1,
            currencyToAccept: "0x0000000000000000000000000000000000000000",
            reservePricePerToken: 0,
            buyoutPricePerToken: 0,
            listingType: 0,
          },
        ],
        {
          gasLimit: 800000,
        },
      );
      expect.fail();
    } catch (err) {
      // In this case, call static should go through after sendTransaction
      // so we should have a hash on the error
      expectError(err, "!BALNFT");
      expect(err.info.hash).to.be.a("string");
      expect(err.info.hash).to.satisfy(
        (hash: string) => hash.startsWith("0x") && hash.length === 66,
      );
    }
  });
});
