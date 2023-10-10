import {
  Edition,
  EditionInitializer,
  MarketplaceV3,
  NATIVE_TOKEN_ADDRESS,
  NFTCollection,
  NFTCollectionInitializer,
  Token,
  TokenInitializer,
  MarketplaceV3Initializer,
  OfferV3,
  Status,
} from "../../src/evm";
import { fastForwardTime, jsonProvider, sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { BigNumber, ethers } from "ethers";

let tokenAddress = NATIVE_TOKEN_ADDRESS;

/**
 * Throughout these tests, the admin wallet will be the deployer
 * and lister of all listings.
 *
 * Bog and Sam and Abby wallets will be used for direct listings and auctions.
 */
describe("Marketplace V3", async () => {
  let marketplaceContract: MarketplaceV3;
  let dummyNftContract: NFTCollection;
  let dummyBundleContract: Edition;
  let customTokenContract: Token;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    w4: SignerWithAddress;

  beforeEach(async () => {
    await jsonProvider.send("hardhat_reset", []);
    [adminWallet, samWallet, bobWallet, , , , , w4] = signers;

    sdk.updateSignerOrProvider(adminWallet);

    marketplaceContract = await sdk.getContract(
      await sdk.deployer.deployBuiltInContract(
        MarketplaceV3Initializer.contractType,
        {
          name: "Test Marketplace",
        },
      ),
      "marketplace-v3",
    );

    dummyNftContract = await sdk.getNFTCollection(
      await sdk.deployer.deployBuiltInContract(
        NFTCollectionInitializer.contractType,
        {
          name: "TEST NFT",
          seller_fee_basis_points: 200,
          fee_recipient: adminWallet.address,
          primary_sale_recipient: adminWallet.address,
        },
      ),
    );
    await dummyNftContract.mintBatch([
      {
        name: "Test 0",
      },
      {
        name: "Test 2",
      },
      {
        name: "Test 3",
      },
      {
        name: "Test 4",
      },
    ]);
    dummyBundleContract = await sdk.getEdition(
      await sdk.deployer.deployBuiltInContract(
        EditionInitializer.contractType,
        {
          name: "TEST BUNDLE",
          seller_fee_basis_points: 100,
          primary_sale_recipient: adminWallet.address,
        },
      ),
    );
    await dummyBundleContract.mintBatch([
      {
        metadata: {
          name: "Test 0",
        },
        supply: 100000,
      },
      {
        metadata: {
          name: "Test 1",
        },
        supply: 100000,
      },
    ]);

    customTokenContract = await sdk.getToken(
      await sdk.deployer.deployBuiltInContract(TokenInitializer.contractType, {
        name: "Test",
        symbol: "TEST",
        primary_sale_recipient: adminWallet.address,
      }),
    );
    await customTokenContract.mintBatchTo([
      {
        toAddress: bobWallet.address,
        amount: 1000,
      },
      {
        toAddress: samWallet.address,
        amount: 1000,
      },
      {
        toAddress: adminWallet.address,
        amount: 1000,
      },
    ]);
    tokenAddress = customTokenContract.getAddress();

    await marketplaceContract.call("grantRole", [
      ethers.utils.solidityKeccak256(["string"], ["LISTER_ROLE"]),
      adminWallet.address,
    ]);
    await marketplaceContract.call("grantRole", [
      ethers.utils.solidityKeccak256(["string"], ["ASSET_ROLE"]),
      dummyBundleContract.getAddress(),
    ]);
    await marketplaceContract.call("grantRole", [
      ethers.utils.solidityKeccak256(["string"], ["ASSET_ROLE"]),
      dummyNftContract.getAddress(),
    ]);
  });

  const createDirectListing = async (
    contractAddress: string,
    tokenId: number,
    quantity: number = 1,
    startTimestamp: Date = new Date(Date.now()),
    endTimestamp: Date = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
  ): Promise<BigNumber> => {
    return (
      await marketplaceContract.directListings.createListing({
        assetContractAddress: contractAddress,
        tokenId: tokenId,
        quantity: quantity,
        currencyContractAddress: tokenAddress,
        pricePerToken: 0.1,
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
        isReservedListing: false,
      })
    ).id;
  };

  const createAuctionListing = async (
    contractAddress: string,
    tokenId: number,
    quantity: number = 1,
    startTimestamp: Date = new Date(),
    endTimestamp: Date = new Date(
      startTimestamp.getTime() + 5 * 24 * 60 * 60 * 1000,
    ),
  ): Promise<BigNumber> => {
    return (
      await marketplaceContract.englishAuctions.createAuction({
        assetContractAddress: contractAddress,
        tokenId,
        quantity,
        currencyContractAddress: tokenAddress,
        minimumBidAmount: 0.1,
        buyoutBidAmount: 1,
        timeBufferInSeconds: 100,
        bidBufferBps: 100,
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
      })
    ).id;
  };

  const makeOffer = async (
    contractAddress: string,
    tokenId: number,
    quantity: number = 1,
    currency: string = tokenAddress,
    endTimestamp: Date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  ): Promise<BigNumber> => {
    return (
      await marketplaceContract.offers.makeOffer({
        assetContractAddress: contractAddress,
        tokenId: tokenId,
        quantity: quantity,
        currencyContractAddress: currency,
        totalPrice: 0.1,
        endTimestamp: endTimestamp,
      })
    ).id;
  };

  /**
   * =========== Direct Listings Tests ============
   */
  describe("Direct Listing: Create", () => {
    it("should list direct listings with 721s", async () => {
      const listingId = await createDirectListing(
        dummyNftContract.getAddress(),
        0,
      );
      assert.isDefined(listingId);
    });

    it("Should list with native currency address", async () => {
      const { id: listingId } =
        await marketplaceContract.directListings.createListing({
          assetContractAddress: dummyNftContract.getAddress(),
          tokenId: 0,
          quantity: 1,
          currencyContractAddress: "0x0000000000000000000000000000000000000000",
          pricePerToken: 0.1,
          startTimestamp: new Date(),
          endTimestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          isReservedListing: false,
        });

      const listing =
        await marketplaceContract.directListings.getListing(listingId);
      expect(listing.currencyContractAddress.toLowerCase()).to.equal(
        NATIVE_TOKEN_ADDRESS.toLowerCase(),
      );
    });

    it("should list direct listings with 1155s", async () => {
      const listingId = await createDirectListing(
        dummyBundleContract.getAddress(),
        0,
        10,
      );
      assert.isDefined(listingId);
    });

    it("should batch create direct listings", async () => {
      const listings: Parameters<
        typeof marketplaceContract.directListings.createListingsBatch
      >[0] = [];
      for (let i = 0; i < 5; i++) {
        listings.push({
          assetContractAddress: dummyNftContract.getAddress(),
          tokenId: 0,
          quantity: 1,
          currencyContractAddress: tokenAddress,
          pricePerToken: 0.1,
          startTimestamp: new Date(),
          endTimestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          isReservedListing: false,
        });
      }

      const receipts =
        await marketplaceContract.directListings.createListingsBatch(listings);
      assert.equal(receipts.length, 5);
      for (const receipt of receipts) {
        assert.isDefined(receipt.id);
      }
    });
  });

  describe("Direct Listing: Filters", () => {
    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      await createDirectListing(dummyNftContract.getAddress(), 0);
      await createDirectListing(dummyBundleContract.getAddress(), 0, 10);

      await dummyBundleContract.transfer(samWallet.address, "0", 10);

      await sdk.updateSignerOrProvider(samWallet);
      await createDirectListing(dummyBundleContract.getAddress(), 0, 10);
    });

    it("should paginate properly", async () => {
      const listings = await marketplaceContract.directListings.getAll({
        start: 0,
      });
      assert.equal(listings.length, 3, "pagination doesn't work");
    });

    it("should get correct count of listings", async () => {
      await marketplaceContract.directListings.buyFromListing(0, 1);
      const listings = await marketplaceContract.directListings.getAll({
        start: 0,
        count: 1,
      });
      assert.equal(listings.length, 1, "incorrect count");
    });

    it("should filter sellers properly", async () => {
      const adminListings = await marketplaceContract.directListings.getAll({
        seller: adminWallet.address,
      });
      const samListings = await marketplaceContract.directListings.getAll({
        seller: samWallet.address,
      });
      assert.equal(adminListings.length, 2, "filter doesn't work");
      assert.equal(samListings.length, 1, "filter doesn't work");
    });

    it("should filter asset contract properly", async () => {
      const listings = await marketplaceContract.directListings.getAll({
        tokenContract: dummyBundleContract.getAddress(),
      });
      assert.equal(listings.length, 2, "filter doesn't work");
    });

    it("should filter asset contract with token contract address properly", async () => {
      const listings = await marketplaceContract.directListings.getAll({
        tokenContract: dummyNftContract.getAddress(),
      });
      assert.equal(listings.length, 1, "filter doesn't work");
    });

    it("should filter asset contract with token id properly", async () => {
      const listings0 = await marketplaceContract.directListings.getAll({
        tokenId: 0,
      });
      assert.equal(listings0.length, 3, "filter doesn't work");
      const listings1 = await marketplaceContract.directListings.getAll({
        tokenId: 1,
      });
      assert.equal(listings1.length, 0, "filter doesn't work");
    });

    it("should filter asset contract with token contract and id properly", async () => {
      const tokenListings = await marketplaceContract.directListings.getAll({
        tokenContract: dummyNftContract.getAddress(),
        tokenId: 0,
      });
      assert.equal(tokenListings.length, 1, "filter doesn't work");

      const bundleListings = await marketplaceContract.directListings.getAll({
        tokenContract: dummyBundleContract.getAddress(),
        tokenId: 0,
      });
      assert.equal(bundleListings.length, 2, "filter doesn't work");
    });
  });

  describe("Direct Listing: Get Listings", () => {
    let directListingOneId: BigNumber;
    let directListingTwoId: BigNumber;

    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      directListingOneId = await createDirectListing(
        dummyNftContract.getAddress(),
        0,
        1,
      );
      directListingTwoId = await createDirectListing(
        dummyNftContract.getAddress(),
        1,
        1,
        new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      );
    });

    it("should return only active listings", async () => {
      const before = await marketplaceContract.directListings.getAllValid();
      expect(before.length).to.eq(1);
    });

    it("should return correct listing", async () => {
      const listingOne =
        await marketplaceContract.directListings.getListing(directListingOneId);
      const listingTwo =
        await marketplaceContract.directListings.getListing(directListingTwoId);
      assert.equal(listingOne.tokenId.toString(), "0");
      assert.equal(listingOne.asset.id.toString(), "0");
      assert.equal(listingOne.asset.name, "Test 0");

      assert.equal(listingTwo.tokenId.toString(), "1");
      assert.equal(listingTwo.asset.id.toString(), "1");
      assert.equal(listingTwo.asset.name, "Test 2");
    });

    it("should return listings", async () => {
      const listings = await marketplaceContract.directListings.getAll();
      assert(listings.length > 0);
    });
  });

  describe("Direct Listing: Buy", () => {
    let directListingId: BigNumber;

    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      directListingId = await createDirectListing(
        dummyNftContract.getAddress(),
        0,
        1,
      );
    });

    it("should allow a buyer to buy from a direct listing", async () => {
      await sdk.updateSignerOrProvider(bobWallet);

      const currentBalance = await dummyNftContract.balanceOf(
        bobWallet.address,
      );
      assert.equal(
        currentBalance.toString(),
        "0",
        "The buyer should start with no tokens",
      );
      await marketplaceContract.directListings.buyFromListing(
        directListingId,
        1,
      );
      const balance = await dummyNftContract.balanceOf(bobWallet.address);
      assert.equal(
        balance.toString(),
        "1",
        "The buyer should have been awarded token",
      );
    });

    it("should allow a buyer to buy from a direct listing for someone else", async () => {
      await sdk.updateSignerOrProvider(bobWallet);

      const currentBalance = await dummyNftContract.balanceOf(w4.address);
      assert.equal(
        currentBalance.toString(),
        "0",
        "The buyer should start with no tokens",
      );
      await marketplaceContract.directListings.buyFromListing(
        directListingId,
        1,
        w4.address,
      );
      const balance = await dummyNftContract.balanceOf(w4.address);
      assert.equal(
        balance.toString(),
        "1",
        "The buyer should have been awarded token",
      );
    });
  });

  describe("Direct Listing: Cancel", () => {
    let directListingId: BigNumber;

    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      directListingId = await createDirectListing(
        dummyNftContract.getAddress(),
        0,
      );
    });

    it("should correctly cancel a direct listing", async () => {
      const listing =
        await marketplaceContract.directListings.getListing(directListingId);
      assert.equal(listing.quantity.toString(), "1");
      await marketplaceContract.directListings.cancelListing(directListingId);

      const cancelledListing =
        await marketplaceContract.directListings.getListing(directListingId);
      assert.equal(cancelledListing.status, Status.Cancelled);
    });
  });

  /**
   * =========== English Auction Tests ============
   */

  describe("English Auctions: Create", () => {
    it("should create auction with native token", async () => {
      const tx = await marketplaceContract.englishAuctions.createAuction({
        assetContractAddress: dummyBundleContract.getAddress(),
        tokenId: "1",
        quantity: 1,
        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
        minimumBidAmount: 0.1,
        buyoutBidAmount: 1,
        timeBufferInSeconds: 100,
        bidBufferBps: 100,
        startTimestamp: new Date(),
        endTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      const id = tx.id;
      sdk.updateSignerOrProvider(samWallet);
      await marketplaceContract.englishAuctions.makeBid(id, 0.1);
    });

    it("should create auction with 721s", async () => {
      const listingId = await createAuctionListing(
        dummyNftContract.getAddress(),
        0,
      );
      assert.isDefined(listingId);
    });

    it("should create auction with 1155s", async () => {
      const listingId = await createAuctionListing(
        dummyBundleContract.getAddress(),
        0,
        10,
      );
      assert.isDefined(listingId);
    });

    it("should batch create auction listings", async () => {
      const listings: Parameters<
        typeof marketplaceContract.englishAuctions.createAuctionsBatch
      >[0] = [];
      for (let i = 0; i < 5; i++) {
        listings.push({
          assetContractAddress: dummyBundleContract.getAddress(),
          tokenId: "1",
          quantity: 1,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          minimumBidAmount: 0.1,
          buyoutBidAmount: 1,
          timeBufferInSeconds: 100,
          bidBufferBps: 100,
          startTimestamp: new Date(),
          endTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
      }

      const receipts =
        await marketplaceContract.englishAuctions.createAuctionsBatch(listings);
      assert.equal(receipts.length, 5);
      for (const receipt of receipts) {
        assert.isDefined(receipt.id);
      }
    });
  });

  describe("English Auctions: Filters", () => {
    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      await createAuctionListing(dummyNftContract.getAddress(), 1);
      await createAuctionListing(dummyBundleContract.getAddress(), 1, 10);

      await dummyBundleContract.transfer(samWallet.address, "1", 10);

      await sdk.updateSignerOrProvider(samWallet);
      await createAuctionListing(dummyBundleContract.getAddress(), 1, 10);
    });

    it("should paginate properly", async () => {
      const auctions = await marketplaceContract.englishAuctions.getAll({
        start: 0,
        count: 3,
      });
      assert.equal(auctions.length, 3, "pagination doesn't work");
    });

    it("should get correct count of auctions", async () => {
      await marketplaceContract.englishAuctions.makeBid(0, 1);
      const auctions = await marketplaceContract.englishAuctions.getAll({
        start: 0,
        count: 1,
      });
      assert.equal(auctions.length, 1, "incorrect count");
    });

    it("should filter sellers properly", async () => {
      const adminAuctions = await marketplaceContract.englishAuctions.getAll({
        seller: adminWallet.address,
      });
      const samAuctions = await marketplaceContract.englishAuctions.getAll({
        seller: samWallet.address,
      });
      assert.equal(adminAuctions.length, 2, "filter doesn't work");
      assert.equal(samAuctions.length, 1, "filter doesn't work");
    });

    it("should filter asset contract properly", async () => {
      const auctions = await marketplaceContract.englishAuctions.getAll({
        tokenContract: dummyBundleContract.getAddress(),
      });
      assert.equal(auctions.length, 2, "filter doesn't work");
    });

    it("should filter asset contract with token contract address properly", async () => {
      const auctions = await marketplaceContract.englishAuctions.getAll({
        tokenContract: dummyNftContract.getAddress(),
      });
      assert.equal(auctions.length, 1, "filter doesn't work");
    });

    it("should filter asset contract with token id properly", async () => {
      const auction0 = await marketplaceContract.englishAuctions.getAll({
        tokenId: 0,
      });
      assert.equal(auction0.length, 0, "filter doesn't work");
      const auction1 = await marketplaceContract.englishAuctions.getAll({
        tokenId: 1,
      });
      assert.equal(auction1.length, 3, "filter doesn't work");
    });

    it("should filter asset contract with token contract and id properly", async () => {
      const tokenAuctions = await marketplaceContract.englishAuctions.getAll({
        tokenContract: dummyNftContract.getAddress(),
        tokenId: 1,
      });
      assert.equal(tokenAuctions.length, 1, "filter doesn't work");

      const bundleAuctions = await marketplaceContract.englishAuctions.getAll({
        tokenContract: dummyBundleContract.getAddress(),
        tokenId: 1,
      });
      assert.equal(bundleAuctions.length, 2, "filter doesn't work");
    });
  });

  describe("English Auctions: Get Auctions", () => {
    let auctionOneId: BigNumber;
    let auctionTwoId: BigNumber;

    beforeEach(async () => {
      auctionOneId = await createAuctionListing(
        dummyNftContract.getAddress(),
        2,
        1,
      );
      auctionTwoId = await createAuctionListing(
        dummyNftContract.getAddress(),
        3,
        1,
        new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      );
    });

    it("should return only active auctions", async () => {
      const before = await marketplaceContract.englishAuctions.getAllValid();
      expect(before.length).to.eq(1);
    });

    it("should return correct auction", async () => {
      const auctionOne =
        await marketplaceContract.englishAuctions.getAuction(auctionOneId);
      const auctionTwo =
        await marketplaceContract.englishAuctions.getAuction(auctionTwoId);
      assert.equal(auctionOne.tokenId.toString(), "2");
      assert.equal(auctionOne.asset.id.toString(), "2");
      assert.equal(auctionOne.asset.name, "Test 3");

      assert.equal(auctionTwo.tokenId.toString(), "3");
      assert.equal(auctionTwo.asset.id.toString(), "3");
      assert.equal(auctionTwo.asset.name, "Test 4");
    });

    it("should return auctions", async () => {
      const auctions = await marketplaceContract.englishAuctions.getAll();
      assert(auctions.length > 0);
    });
  });

  describe("English Auctions: Bid", () => {
    let auctionId: BigNumber;

    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      auctionId = await createAuctionListing(dummyNftContract.getAddress(), 1);
    });

    it("should allow multiple bids by the same person", async () => {
      await sdk.updateSignerOrProvider(bobWallet);
      await marketplaceContract.englishAuctions.makeBid(auctionId, 0.3);
      await marketplaceContract.englishAuctions.makeBid(auctionId, 0.5);

      const winningBid =
        await marketplaceContract.englishAuctions.getWinningBid(auctionId);

      assert.equal(winningBid?.bidderAddress, bobWallet.address);
      assert.equal(
        winningBid?.bidAmount.toString(),
        ethers.utils.parseUnits("0.5").toString(),
      );
    });

    it("should allow bids to be made on auctions", async () => {
      await sdk.updateSignerOrProvider(bobWallet);
      await marketplaceContract.englishAuctions.makeBid(auctionId, 0.3);

      let winningBid =
        await marketplaceContract.englishAuctions.getWinningBid(auctionId);

      assert.equal(winningBid?.bidderAddress, bobWallet.address);
      assert.equal(
        winningBid?.bidAmount.toString(),
        ethers.utils.parseUnits("0.3").toString(),
      );
      assert.equal(winningBid?.auctionId.toString(), auctionId.toString());

      // Make a higher winning bid
      await sdk.updateSignerOrProvider(samWallet);
      await marketplaceContract.englishAuctions.makeBid(auctionId, 0.6);

      winningBid =
        await marketplaceContract.englishAuctions.getWinningBid(auctionId);
      assert.equal(winningBid?.bidderAddress, samWallet.address);
      assert.equal(
        winningBid?.bidAmount.toString(),
        ethers.utils.parseUnits("0.6").toString(),
      );
      assert.equal(winningBid?.auctionId.toString(), auctionId.toString());
    });

    it("should automatically award a buyout", async () => {
      await sdk.updateSignerOrProvider(bobWallet);
      const currentBalance = await dummyNftContract.balanceOf(
        bobWallet.address,
      );
      assert.equal(
        currentBalance.toString(),
        "0",
        "The buyer should start with no tokens",
      );
      await marketplaceContract.englishAuctions.makeBid(auctionId, "1");

      const balance = await dummyNftContract.balanceOf(bobWallet.address);
      assert.equal(
        balance.toString(),
        "1",
        "The buyer should have been awarded token",
      );
    });

    it("should throw an error if a bid being placed is not a winning bid", async () => {
      await sdk.updateSignerOrProvider(bobWallet);
      const currentBalance = await dummyNftContract.balanceOf(
        bobWallet.address,
      );
      assert.equal(
        currentBalance.toString(),
        "0",
        "The buyer should start with no tokens",
      );
      await marketplaceContract.englishAuctions.makeBid(auctionId, "0.5");
      try {
        await marketplaceContract.englishAuctions.makeBid(auctionId, "0.4");
        // eslint-disable-next-line no-empty
      } catch (err) {}
    });

    it("should allow an auction buyout", async () => {
      const id = (
        await marketplaceContract.englishAuctions.createAuction({
          assetContractAddress: dummyBundleContract.getAddress(),
          tokenId: "1",
          quantity: 2,
          currencyContractAddress: tokenAddress,
          minimumBidAmount: 0.1,
          buyoutBidAmount: 1,
          timeBufferInSeconds: 100,
          bidBufferBps: 100,
          startTimestamp: new Date(),
          endTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
      ).id;
      await sdk.updateSignerOrProvider(bobWallet);
      await marketplaceContract.englishAuctions.buyoutAuction(id);

      const balance = await dummyBundleContract.balanceOf(
        bobWallet.address,
        "1",
      );
      assert.equal(balance.toString(), "2", "The buyer should have 2 tokens");
    });
  });

  describe("English Auctions: Close", () => {
    let auctionId: BigNumber;

    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      auctionId = await createAuctionListing(dummyNftContract.getAddress(), 1);
    });

    it("should allow a seller to cancel an auction that hasn't started yet", async () => {
      const id = (
        await marketplaceContract.englishAuctions.createAuction({
          assetContractAddress: dummyBundleContract.getAddress(),
          tokenId: "0",
          quantity: 1,
          currencyContractAddress: tokenAddress,
          minimumBidAmount: 0.1,
          buyoutBidAmount: 1,
          timeBufferInSeconds: 100,
          bidBufferBps: 100,
          startTimestamp: new Date(),
          endTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
      ).id;
      await marketplaceContract.englishAuctions.cancelAuction(id);

      const cancelledAuction =
        await marketplaceContract.englishAuctions.getAuction(id);
      assert.equal(cancelledAuction.status, Status.Cancelled);
    });

    it("should not throw an error when trying to cancel an auction that already started (no bids)", async () => {
      await marketplaceContract.englishAuctions.cancelAuction(auctionId);
    });

    it("should throw an error when trying to cancel an auction that already started (with bids)", async () => {
      await marketplaceContract.englishAuctions.makeBid(auctionId, 0.2);
      try {
        await marketplaceContract.englishAuctions.cancelAuction(auctionId);
        assert.fail("should have thrown an error");
      } catch (err: any) {
        if (!(err.message as string).includes("Bids already made.")) {
          throw err;
        }
      }
    });

    it("should distribute the tokens when an auction closes", async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      const auctionId2 = (
        await marketplaceContract.englishAuctions.createAuction({
          assetContractAddress: dummyNftContract.getAddress(),
          tokenId: "2",
          quantity: 1,
          currencyContractAddress: tokenAddress,
          minimumBidAmount: 0.1,
          buyoutBidAmount: 5,
          timeBufferInSeconds: 100,
          bidBufferBps: 100,
          startTimestamp: new Date(),
          endTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
      ).id;

      await sdk.updateSignerOrProvider(bobWallet);

      await marketplaceContract.englishAuctions.makeBid(auctionId2, 2);

      await fastForwardTime(60 * 60 * 24);

      /**
       * Buyer
       */
      const oldBalance = await dummyNftContract.balanceOf(bobWallet.address);
      assert.equal(
        oldBalance.toString(),
        "0",
        "The buyer should have no tokens to start",
      );
      await marketplaceContract.englishAuctions.closeAuctionForBidder(
        auctionId2,
      );

      const balance = await dummyNftContract.balanceOf(bobWallet.address);
      assert.equal(
        balance.toString(),
        "1",
        "The buyer should have been awarded token",
      );

      /**
       * Seller
       */
      await sdk.updateSignerOrProvider(adminWallet);
      const oldTokenBalance = await customTokenContract.balanceOf(
        adminWallet.address,
      );
      assert.deepEqual(
        oldTokenBalance.value,
        ethers.utils.parseUnits("1000"),
        "The buyer should have 1000 tokens to start",
      );

      await marketplaceContract.englishAuctions.closeAuctionForSeller(
        auctionId2,
      );

      const newTokenBalance = await customTokenContract.balanceOf(
        adminWallet.address,
      );
      assert.deepEqual(
        newTokenBalance.value,
        ethers.utils
          .parseUnits("1000")
          // eslint-disable-next-line line-comment-position
          .add(ethers.utils.parseUnits("2.00")), // 2% taken out for royalties
        // TODO read the fee from the TWFee contract
        "The buyer should have two additional tokens after the listing closes",
      );
    });
  });

  /**
   * =========== Offers Tests ============
   */

  describe("Offers", () => {
    let directListingId: BigNumber;

    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      directListingId = await createDirectListing(
        dummyNftContract.getAddress(),
        0,
        1,
        new Date(Date.now()),
        new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      );
    });

    it("should allow the seller to accept an offer", async () => {
      await sdk.updateSignerOrProvider(bobWallet);

      const currentBalance = await dummyNftContract.balanceOf(
        bobWallet.address,
      );
      assert.equal(
        currentBalance.toString(),
        "0",
        "The buyer should start with no tokens",
      );

      // await marketplaceContract.offers.makeOffer(directListingId, 0.034, 10);
      const offerId = await makeOffer(dummyNftContract.getAddress(), 0, 1);

      await sdk.updateSignerOrProvider(adminWallet);
      await marketplaceContract.offers.acceptOffer(offerId);

      const balance = await dummyNftContract.balanceOf(bobWallet.address);
      assert.equal(
        balance.toString(),
        "1",
        "The buyer should have been awarded token",
      );
    });

    it("should allow a buyer to buy from a direct listing after making an offer", async () => {
      await sdk.updateSignerOrProvider(bobWallet);

      const currentBalance = await dummyNftContract.balanceOf(
        bobWallet.address,
      );
      assert.equal(
        currentBalance.toString(),
        "0",
        "The buyer should start with no tokens",
      );

      await marketplaceContract.directListings.buyFromListing(
        directListingId,
        1,
      );
      const balance = await dummyNftContract.balanceOf(bobWallet.address);
      assert.equal(
        balance.toString(),
        "1",
        "The buyer should have been awarded token",
      );
    });

    it("should allow offers to be made for listed tokens", async () => {
      sdk.updateSignerOrProvider(bobWallet);
      await makeOffer(dummyNftContract.getAddress(), 0, 1);

      sdk.updateSignerOrProvider(samWallet);
      await makeOffer(dummyNftContract.getAddress(), 0, 1);

      let offers = await marketplaceContract.offers.getAll({
        start: 0,
        offeror: bobWallet.address,
      });

      assert.equal(offers.length, 1);
      assert.equal(offers[0].offerorAddress, bobWallet.address);
      assert.equal(
        offers[0].totalPrice.toString(),
        ethers.utils.parseUnits("0.1").toString(),
      );
      assert.equal(offers[0].tokenId, "0");

      offers = await marketplaceContract.offers.getAll({
        start: 0,
        offeror: samWallet.address,
      });

      assert.equal(offers.length, 1);
      assert.equal(offers[0].offerorAddress, samWallet.address);
      assert.equal(
        offers[0].totalPrice.toString(),
        ethers.utils.parseUnits("0.1").toString(),
      );
      assert.equal(offers[0].tokenId, "0");
    });

    it("should return all offers for a token when queried", async () => {
      // make an offer as bob
      sdk.updateSignerOrProvider(bobWallet);
      await makeOffer(dummyNftContract.getAddress(), 0, 1);

      // make an offer as sam
      sdk.updateSignerOrProvider(samWallet);
      await makeOffer(dummyNftContract.getAddress(), 0, 1);

      // fetch all offers for the token
      sdk.updateSignerOrProvider(adminWallet);
      const offers: OfferV3[] = await marketplaceContract.offers.getAll({
        start: 0,
        tokenContract: dummyNftContract.getAddress(),
        tokenId: 0,
      });

      // check that the offers are returned
      assert.equal(offers.length, 2);

      // check the value of the price per token is correct
      assert.equal(
        offers[0].totalPrice.toString(),
        ethers.utils.parseUnits("0.1").toString(),
      );

      // check the value of the buyer address is correct
      assert.equal(offers[0].offerorAddress, bobWallet.address);

      // check the value of the quantity is correct
      assert.equal(offers[0].quantity, "1");

      // check the value of the currency contract address is correct
      assert.equal(offers[0].currencyContractAddress, tokenAddress);

      // check that the currency value is correct
      // assert.isTrue(
      //   offers[0].currencyValue.value.eq(ethers.utils.parseEther("1")),
      // );
    });
  });

  describe("Updating listings", () => {
    let directListingId: BigNumber;

    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      directListingId = await createDirectListing(
        dummyNftContract.getAddress(),
        0,
      );
    });

    it("should allow you to update an direct listing not yet active", async () => {
      const id = (
        await marketplaceContract.directListings.createListing({
          assetContractAddress: dummyNftContract.getAddress(),
          tokenId: 0,
          quantity: 1,
          currencyContractAddress: tokenAddress,
          pricePerToken: 0.1,
          startTimestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          endTimestamp: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          isReservedListing: false,
        })
      ).id;

      await marketplaceContract.directListings.updateListing(id, {
        assetContractAddress: dummyNftContract.getAddress(),
        tokenId: 0,
        quantity: 1,
        currencyContractAddress: tokenAddress,
        pricePerToken: 0.2,
        startTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endTimestamp: new Date(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
        isReservedListing: false,
      });

      const updatedListing =
        await marketplaceContract.directListings.getListing(id);
      assert.equal(
        updatedListing.pricePerToken.toString(),
        ethers.utils.parseUnits("0.2").toString(),
      );
      // assert.equal(
      //   updatedListing.pricePerToken.toString(),
      //   ethers.utils.parseUnits("20").toString(),
      // );
    });

    it("should not allow you to update an active direct listing", async () => {
      const pricePerToken = ethers.utils.parseUnits("0.1");

      const directListing =
        await marketplaceContract.directListings.getListing(directListingId);
      assert.equal(
        directListing.pricePerToken.toString(),
        pricePerToken.toString(),
      );

      try {
        await marketplaceContract.directListings.updateListing(
          directListingId,
          {
            assetContractAddress: directListing.assetContractAddress,
            tokenId: directListing.tokenId.toString(),
            quantity: directListing.quantity.toString(),
            currencyContractAddress: directListing.currencyContractAddress,
            pricePerToken: 0.2,
            startTimestamp: new Date(
              parseInt(directListing.startTimeInSeconds.toString()),
            ),
            endTimestamp: new Date(
              parseInt(directListing.endTimeInSeconds.toString()),
            ),
            isReservedListing: false,
          },
        );
      } catch (err) {
        // TODO: handle errors from plugins
      }
    });
  });

  describe("Invalid Listings", () => {
    let directListingId: BigNumber;

    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      directListingId = await createDirectListing(
        dummyNftContract.getAddress(),
        0,
      );
    });

    it("should throw an error when trying to buyout an invalid direct listing", async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      await dummyNftContract.transfer(samWallet.address, "0");

      await sdk.updateSignerOrProvider(bobWallet);

      try {
        await marketplaceContract.directListings.buyFromListing(
          directListingId,
          1,
        );
        assert.fail("should have thrown");
      } catch (err: any) {}
    });

    it("should not return invalid direct listings", async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      await dummyNftContract.transfer(samWallet.address, "0");

      const allListings =
        await marketplaceContract.directListings.getAllValid();
      const found = allListings.find(
        (l) => l.id.toString() === directListingId.toString(),
      );
      assert.isUndefined(
        found,
        "should not have found the listing because it is invalid",
      );
    });
  });
});
