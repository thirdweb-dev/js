import {
  AuctionAlreadyStartedError,
  DirectListingV3,
  EnglishAuction,
  Edition,
  EditionInitializer,
  ListingNotFoundError,
  MarketplaceV3,
  MarketplaceInitializer,
  NATIVE_TOKEN_ADDRESS,
  NFTCollection,
  NFTCollectionInitializer,
  OfferV3,
  Token,
  TokenInitializer,
  WrongListingTypeError,
} from "../../src/evm";
import { isWinningBid } from "../../src/evm/common/marketplace";
import {
  expectError,
  fastForwardTime,
  jsonProvider,
  sdk,
  signers,
  hardhatEthers,
} from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, BigNumberish, ethers } from "ethers";

global.fetch = require("cross-fetch");

let tokenAddress = NATIVE_TOKEN_ADDRESS;

/**
 * Throughout these tests, the admin wallet will be the deployer
 * and lister of all listings.
 *
 * Bog and Sam and Abby wallets will be used for direct listings and auctions.
 */
describe("Marketplace Contract", async () => {
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

    marketplaceContract = await sdk.getMarketplace(
      await sdk.deployer.deployBuiltInContract(
        MarketplaceInitializer.contractType,
        {
          name: "Test Marketplace",
        },
      ),
    );
    // console.log(marketplaceContract.getAddress());
    // console.log(await marketplaceContract.call("contractVersion"));

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

    await marketplaceContract.call(
      "grantRole",
      ethers.utils.solidityKeccak256(["string"], ["LISTER_ROLE"]),
      adminWallet.address,
    );
    await marketplaceContract.call(
      "grantRole",
      ethers.utils.solidityKeccak256(["string"], ["ASSET_ROLE"]),
      dummyBundleContract.getAddress(),
    );
    await marketplaceContract.call(
      "grantRole",
      ethers.utils.solidityKeccak256(["string"], ["ASSET_ROLE"]),
      dummyNftContract.getAddress(),
    );
  });

  const createDirectListing = async (
    contractAddress: string,
    tokenId: BigNumberish,
    quantity: BigNumberish = 1,
    startTimestamp: Date = new Date(),
    endTimestamp: Date = new Date(
      startTimestamp.getTime() + 5 * 24 * 60 * 60 * 1000,
    ),
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
    tokenId: BigNumberish,
    quantity: BigNumberish = 1,
    startTimestamp: Date = new Date(),
    endTimestamp: Date = new Date(
      startTimestamp.getTime() + 5 * 24 * 60 * 60 * 1000,
    ),
    reservePricePerToken = 0.05,
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
    tokenId: BigNumberish,
    quantity: BigNumberish = 1,
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
  describe("Create Direct Listing", () => {
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
          startTimestamp: new Date("2023-01-25"), // start date can be in the past
          endTimestamp: new Date("2023-01-28"),
          isReservedListing: false,
        });

      const listing = await marketplaceContract.directListings.getListing(
        listingId,
      );
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

    // it.skip("should be able to restrict listing", async () => {
    //   await marketplaceContract.allowListingFromSpecificAssetOnly(
    //     dummyBundleContract.getAddress(),
    //   );
    //   const listingId = await createDirectListing(
    //     dummyBundleContract.getAddress(),
    //     0,
    //     10,
    //   );
    //   assert.isDefined(listingId);
    //   try {
    //     await createDirectListing(dummyNftContract.getAddress(), 0, 10);
    //   } catch (e) {
    //     expectError(e, "!ASSET");
    //   }
    // });
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
      const listings = await marketplaceContract.directListings.getAllListings({
        start: 0,
        count: 3,
      });
      assert.equal(listings.length, 3, "pagination doesn't work");
    });

    it("should filter sellers properly", async () => {
      const adminListings =
        await marketplaceContract.directListings.getAllListings({
          seller: adminWallet.address,
        });
      const samListings =
        await marketplaceContract.directListings.getAllListings({
          seller: samWallet.address,
        });
      assert.equal(adminListings.length, 2, "filter doesn't work");
      assert.equal(samListings.length, 1, "filter doesn't work");
    });

    it("should filter asset contract properly", async () => {
      const listings = await marketplaceContract.directListings.getAllListings({
        tokenContract: dummyBundleContract.getAddress(),
      });
      assert.equal(listings.length, 2, "filter doesn't work");
    });

    it("should filter asset contract with token contract address properly", async () => {
      const listings = await marketplaceContract.directListings.getAllListings({
        tokenContract: dummyNftContract.getAddress(),
      });
      assert.equal(listings.length, 1, "filter doesn't work");
    });

    it("should filter asset contract with token id properly", async () => {
      const listings0 = await marketplaceContract.directListings.getAllListings(
        {
          tokenId: 0,
        },
      );
      assert.equal(listings0.length, 3, "filter doesn't work");
      const listings1 = await marketplaceContract.directListings.getAllListings(
        {
          tokenId: 1,
        },
      );
      assert.equal(listings1.length, 0, "filter doesn't work");
    });

    it("should filter asset contract with token contract and id properly", async () => {
      const tokenListings =
        await marketplaceContract.directListings.getAllListings({
          tokenContract: dummyNftContract.getAddress(),
          tokenId: 0,
        });
      assert.equal(tokenListings.length, 1, "filter doesn't work");

      const bundleListings =
        await marketplaceContract.directListings.getAllListings({
          tokenContract: dummyBundleContract.getAddress(),
          tokenId: 0,
        });
      assert.equal(bundleListings.length, 2, "filter doesn't work");
    });
  });

  describe("Get Listing", () => {
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
      const before =
        await marketplaceContract.directListings.getAllValidListings();
      expect(before.length).to.eq(1);
    });

    it("should return correct listing", async () => {
      const listingOne = await marketplaceContract.directListings.getListing(
        directListingOneId,
      );
      const listingTwo = await marketplaceContract.directListings.getListing(
        directListingTwoId,
      );
      assert.equal(listingOne.tokenId.toString(), "0");
      assert.equal(listingOne.asset.id.toString(), "0");
      assert.equal(listingOne.asset.name, "Test 0");

      assert.equal(listingTwo.tokenId.toString(), "1");
      assert.equal(listingTwo.asset.id.toString(), "1");
      assert.equal(listingTwo.asset.name, "Test 2");
    });

    it("should return listings", async () => {
      const listings =
        await marketplaceContract.directListings.getAllListings();
      assert(listings.length > 0);
    });
  });

  // /**
  //  * =========== English Auction Tests ============
  //  */

  describe("Create English Auction", () => {
    // TODO deploy WETH on hardhat
    // it.skip("should create acuction with native token", async () => {
    //   const tx = await marketplaceContract.auction.createListing({
    //     assetContractAddress: dummyNftContract.getAddress(),
    //     buyoutPricePerToken: 1,
    //     currencyContractAddress: NATIVE_TOKEN_ADDRESS,
    //     startTimestamp: new Date(),
    //     listingDurationInSeconds: 60 * 60 * 24,
    //     tokenId: 0,
    //     quantity: 1,
    //     reservePricePerToken: 0.0001,
    //   });
    //   const id = tx.id;
    //   sdk.updateSignerOrProvider(samWallet);
    //   await marketplaceContract.makeOffer(id, 0.1);
    // });

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

    // it.skip("should be able to restrict auction", async () => {
    //   await marketplaceContract.allowListingFromSpecificAssetOnly(
    //     dummyBundleContract.getAddress(),
    //   );
    //   const listingId = await createDirectListing(
    //     dummyBundleContract.getAddress(),
    //     0,
    //     10,
    //   );
    //   assert.isDefined(listingId);
    //   try {
    //     await createDirectListing(dummyNftContract.getAddress(), 0, 10);
    //   } catch (e) {
    //     expectError(e, "!ASSET");
    //   }
    // });
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
      const auctions = await marketplaceContract.englishAuctions.getAllAuctions(
        {
          start: 0,
          count: 3,
        },
      );
      assert.equal(auctions.length, 3, "pagination doesn't work");
    });

    it("should filter sellers properly", async () => {
      const adminAuctions =
        await marketplaceContract.englishAuctions.getAllAuctions({
          seller: adminWallet.address,
        });
      const samAuctions =
        await marketplaceContract.englishAuctions.getAllAuctions({
          seller: samWallet.address,
        });
      assert.equal(adminAuctions.length, 2, "filter doesn't work");
      assert.equal(samAuctions.length, 1, "filter doesn't work");
    });

    it("should filter asset contract properly", async () => {
      const auctions = await marketplaceContract.englishAuctions.getAllAuctions(
        {
          tokenContract: dummyBundleContract.getAddress(),
        },
      );
      assert.equal(auctions.length, 2, "filter doesn't work");
    });

    it("should filter asset contract with token contract address properly", async () => {
      const auctions = await marketplaceContract.englishAuctions.getAllAuctions(
        {
          tokenContract: dummyNftContract.getAddress(),
        },
      );
      assert.equal(auctions.length, 1, "filter doesn't work");
    });

    it("should filter asset contract with token id properly", async () => {
      const auction0 = await marketplaceContract.englishAuctions.getAllAuctions(
        {
          tokenId: 0,
        },
      );
      assert.equal(auction0.length, 0, "filter doesn't work");
      const auction1 = await marketplaceContract.englishAuctions.getAllAuctions(
        {
          tokenId: 1,
        },
      );
      assert.equal(auction1.length, 3, "filter doesn't work");
    });

    it("should filter asset contract with token contract and id properly", async () => {
      const tokenAuctions =
        await marketplaceContract.englishAuctions.getAllAuctions({
          tokenContract: dummyNftContract.getAddress(),
          tokenId: 1,
        });
      assert.equal(tokenAuctions.length, 1, "filter doesn't work");

      const bundleAuctions =
        await marketplaceContract.englishAuctions.getAllAuctions({
          tokenContract: dummyBundleContract.getAddress(),
          tokenId: 1,
        });
      assert.equal(bundleAuctions.length, 2, "filter doesn't work");
    });
  });

  describe("Get Auction", () => {
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
      const before =
        await marketplaceContract.englishAuctions.getAllValidAuctions();
      expect(before.length).to.eq(1);
    });

    it("should return correct auction", async () => {
      const auctionOne = await marketplaceContract.englishAuctions.getAuction(
        auctionOneId,
      );
      const auctionTwo = await marketplaceContract.englishAuctions.getAuction(
        auctionTwoId,
      );
      assert.equal(auctionOne.tokenId.toString(), "2");
      assert.equal(auctionOne.asset.id.toString(), "2");
      assert.equal(auctionOne.asset.name, "Test 3");

      assert.equal(auctionTwo.tokenId.toString(), "3");
      assert.equal(auctionTwo.asset.id.toString(), "3");
      assert.equal(auctionTwo.asset.name, "Test 4");
    });

    it("should return auctions", async () => {
      const auctions =
        await marketplaceContract.englishAuctions.getAllAuctions();
      assert(auctions.length > 0);
    });
  });

  describe("Offers", () => {
    let directListingId: BigNumber;
    let auctionId: BigNumber;

    beforeEach(async () => {
      await sdk.updateSignerOrProvider(adminWallet);
      directListingId = await createDirectListing(
        dummyNftContract.getAddress(),
        0,
        1,
      );
      auctionId = await createAuctionListing(dummyNftContract.getAddress(), 1);
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
      // await marketplaceContract.makeOffer(directListingId, 0.05, 1);
      const offerId = await makeOffer(dummyNftContract.getAddress(), 0, 1);

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

    it("should allow offers to be made for listed tokens", async () => {
      sdk.updateSignerOrProvider(bobWallet);
      const bobOfferId = await makeOffer(dummyNftContract.getAddress(), 0, 1);

      sdk.updateSignerOrProvider(samWallet);
      const samOfferId = await makeOffer(dummyNftContract.getAddress(), 0, 1);

      let offers = await marketplaceContract.offers.getAllOffers({
        start: 0,
        offeror: bobWallet.address,
      });

      assert.equal(offers.length, 1);
      assert.equal(offers[0].offerorAddress, bobWallet.address);
      assert.equal(
        offers[0].totalPrice.toString(),
        ethers.utils.parseUnits("0.1").toString(),
      );
      assert.equal(offers[0].tokenId, 0);

      offers = await marketplaceContract.offers.getAllOffers({
        start: 0,
        offeror: samWallet.address,
      });

      assert.equal(offers.length, 1);
      assert.equal(offers[0].offerorAddress, samWallet.address);
      assert.equal(
        offers[0].totalPrice.toString(),
        ethers.utils.parseUnits("0.1").toString(),
      );
      assert.equal(offers[0].tokenId, 0);
    });

    it("should allow bids by the same person", async () => {
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

      let winningBid = await marketplaceContract.englishAuctions.getWinningBid(
        auctionId,
      );

      assert.equal(winningBid?.bidderAddress, bobWallet.address);
      assert.equal(
        winningBid?.bidAmount.toString(),
        ethers.utils.parseUnits("0.3").toString(),
      );
      assert.equal(winningBid?.auctionId.toString(), auctionId.toString());

      // Make a higher winning bid
      await sdk.updateSignerOrProvider(samWallet);
      await marketplaceContract.englishAuctions.makeBid(auctionId, 0.6);

      winningBid = await marketplaceContract.englishAuctions.getWinningBid(
        auctionId,
      );
      assert.equal(winningBid?.bidderAddress, samWallet.address);
      assert.equal(
        winningBid?.bidAmount.toString(),
        ethers.utils.parseUnits("0.6").toString(),
      );
      assert.equal(winningBid?.auctionId.toString(), auctionId.toString());
    });

    it("should return all offers for a token when queried", async () => {
      // make an offer as bob
      sdk.updateSignerOrProvider(bobWallet);
      const bobOfferId = await makeOffer(dummyNftContract.getAddress(), 0, 1);

      // make an offer as sam
      sdk.updateSignerOrProvider(samWallet);
      const samOfferId = await makeOffer(dummyNftContract.getAddress(), 0, 1);

      // fetch all offers for the token
      sdk.updateSignerOrProvider(adminWallet);
      const offers: OfferV3[] = await marketplaceContract.offers.getAllOffers({
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
      assert.equal(offers[0].quantity, 1);

      // check the value of the currency contract address is correct
      assert.equal(offers[0].currencyContractAddress, tokenAddress);

      // check that the currency value is correct
      // assert.isTrue(
      //   offers[0].currencyValue.value.eq(ethers.utils.parseEther("1")),
      // );
    });
  });

  // describe("Validators", () => {
  //   let directListingId: BigNumber;
  //   let auctionListingId: BigNumber;

  //   beforeEach(async () => {
  //     await sdk.updateSignerOrProvider(adminWallet);
  //     directListingId = await createDirectListing(
  //       dummyNftContract.getAddress(),
  //       0,
  //     );
  //     auctionListingId = await createAuctionListing(
  //       dummyNftContract.getAddress(),
  //       1,
  //     );
  //   });

  //   it("should throw an error trying to fetch a listing of the wrong type", async () => {
  //     try {
  //       await marketplaceContract.direct.getListing(auctionListingId);
  //       assert.fail("Should have thrown an error");
  //     } catch (err) {
  //       if (!(err instanceof WrongListingTypeError)) {
  //         throw err;
  //       }
  //     }

  //     try {
  //       await marketplaceContract.auction.getListing(directListingId);
  //       assert.fail("Should have thrown an error");
  //     } catch (err) {
  //       if (!(err instanceof WrongListingTypeError)) {
  //         throw err;
  //       }
  //     }
  //   });
  // });

  // describe("Bidding", () => {
  //   let auctionListingId: BigNumber;

  //   beforeEach(async () => {
  //     await sdk.updateSignerOrProvider(adminWallet);
  //     auctionListingId = await createAuctionListing(
  //       dummyNftContract.getAddress(),
  //       1,
  //     );
  //   });

  //   it("should automatically award a buyout", async () => {
  //     await sdk.updateSignerOrProvider(bobWallet);
  //     const currentBalance = await dummyNftContract.balanceOf(
  //       bobWallet.address,
  //     );
  //     assert.equal(
  //       currentBalance.toString(),
  //       "0",
  //       "The buyer should start with no tokens",
  //     );
  //     await marketplaceContract.makeOffer(auctionListingId, "20");

  //     const balance = await dummyNftContract.balanceOf(bobWallet.address);
  //     assert.equal(
  //       balance.toString(),
  //       "1",
  //       "The buyer should have been awarded token",
  //     );
  //   });

  //   // TODO: idk if a seller can close out an auction before the auction
  //   // has ended and so the call to `acceptWinningBid` is failing on this
  //   // test because the listing is still active.
  //   it.skip("should allow the seller to accept the winning bid", async () => {
  //     await sdk.updateSignerOrProvider(bobWallet);
  //     const currentBalance = await dummyNftContract.balanceOf(
  //       bobWallet.address,
  //     );
  //     assert.equal(
  //       currentBalance.toString(),
  //       "0",
  //       "The buyer should start with no tokens",
  //     );
  //     await marketplaceContract.makeOffer(auctionListingId, "2");

  //     const winningBid = (await marketplaceContract.auction.getWinningBid(
  //       auctionListingId,
  //     )) as Offer;

  //     assert.equal(
  //       winningBid.buyerAddress,
  //       bobWallet.address,
  //       "Bob should be the winning bidder",
  //     );

  //     await sdk.updateSignerOrProvider(bobWallet);
  //     await marketplaceContract.auction.closeListing(auctionListingId);
  //     const balance = await dummyNftContract.balanceOf(bobWallet.address);
  //     assert.equal(
  //       balance.toString(),
  //       "1",
  //       "The buyer should have been awarded token",
  //     );

  //     // TODO: write test for calling closeAuctionListing with sellers wallet
  //   });

  //   it("should throw an error if a bid being placed is not a winning bid", async () => {
  //     await sdk.updateSignerOrProvider(bobWallet);
  //     const currentBalance = await dummyNftContract.balanceOf(
  //       bobWallet.address,
  //     );
  //     assert.equal(
  //       currentBalance.toString(),
  //       "0",
  //       "The buyer should start with no tokens",
  //     );
  //     await marketplaceContract.makeOffer(auctionListingId, "2");
  //     try {
  //       await marketplaceContract.makeOffer(auctionListingId, "2.01");
  //       // eslint-disable-next-line no-empty
  //     } catch (err) {}
  //   });

  //   it("should allow an auction buyout", async () => {
  //     const id = (
  //       await marketplaceContract.auction.createListing({
  //         assetContractAddress: dummyBundleContract.getAddress(),
  //         buyoutPricePerToken: 0.8,
  //         currencyContractAddress: tokenAddress,
  //         // to start tomorrow so we can update it
  //         startTimestamp: new Date(),
  //         listingDurationInSeconds: 60 * 60 * 24,
  //         tokenId: "1",
  //         quantity: 2,
  //         reservePricePerToken: 0.2,
  //       })
  //     ).id;
  //     await sdk.updateSignerOrProvider(bobWallet);
  //     await marketplaceContract.buyoutListing(id);

  //     const balance = await dummyBundleContract.balanceOf(
  //       bobWallet.address,
  //       "1",
  //     );
  //     assert.equal(balance.toString(), "2", "The buyer should have 2 tokens");
  //   });
  // });

  // describe("Closing listings", () => {
  //   let directListingId: BigNumber;
  //   let auctionListingId: BigNumber;

  //   beforeEach(async () => {
  //     await sdk.updateSignerOrProvider(adminWallet);
  //     directListingId = await createDirectListing(
  //       dummyNftContract.getAddress(),
  //       0,
  //     );
  //     auctionListingId = await createAuctionListing(
  //       dummyNftContract.getAddress(),
  //       1,
  //     );
  //   });

  //   it("should allow a seller to close an auction that hasn't started yet", async () => {
  //     const id = (
  //       await marketplaceContract.auction.createListing({
  //         assetContractAddress: dummyNftContract.getAddress(),
  //         buyoutPricePerToken: 0.1,
  //         currencyContractAddress: tokenAddress,
  //         // to start tomorrow so we can update it
  //         startTimestamp: new Date(),
  //         listingDurationInSeconds: 60 * 60 * 24,
  //         tokenId: "0",
  //         quantity: 1,
  //         reservePricePerToken: 0.05,
  //       })
  //     ).id;
  //     await marketplaceContract.auction.cancelListing(id);

  //     try {
  //       await marketplaceContract.auction.getListing(id);
  //     } catch (err) {
  //       if (!(err instanceof ListingNotFoundError)) {
  //         throw err;
  //       }
  //     }
  //   });

  //   it("should not throw an error when trying to close an auction that already started (no bids)", async () => {
  //     await marketplaceContract.auction.cancelListing(auctionListingId);
  //   });

  //   it("should throw an error when trying to close an auction that already started (with bids)", async () => {
  //     await marketplaceContract.makeOffer(auctionListingId, 0.06);
  //     try {
  //       await marketplaceContract.auction.cancelListing(auctionListingId);
  //       assert.fail("should have thrown an error");
  //     } catch (err: any) {
  //       if (
  //         !(err instanceof AuctionAlreadyStartedError) &&
  //         !(err.message as string).includes(
  //           "cannot close auction before it has ended",
  //         )
  //       ) {
  //         throw err;
  //       }
  //     }
  //   });

  //   it("should correctly close a direct listing", async () => {
  //     const listing = await marketplaceContract.direct.getListing(
  //       directListingId,
  //     );
  //     assert.equal(listing.quantity.toString(), "1");
  //     await marketplaceContract.direct.cancelListing(directListingId);
  //     try {
  //       await marketplaceContract.direct.getListing(directListingId);
  //     } catch (e) {
  //       if (!(e instanceof ListingNotFoundError)) {
  //         throw e;
  //       }
  //     }
  //   });

  //   // Skipping until decision is made on this:
  //   // https://github.com/nftlabs/nftlabs-sdk-ts/issues/119#issuecomment-1003199128
  //   it.skip("should allow the seller to cancel an auction that has started as long as there are no active bids", async () => {
  //     const startTime = new Date();
  //     const listingId = await createAuctionListing(
  //       dummyNftContract.getAddress(),
  //       2,
  //       1,
  //       startTime,
  //     );

  //     await marketplaceContract.auction.getListing(listingId);
  //     await marketplaceContract.auction.getWinningBid(listingId);

  //     try {
  //       await marketplaceContract.auction.cancelListing(auctionListingId);
  //       // eslint-disable-next-line no-empty
  //     } catch (err) {
  //       console.error("failed to cancel listing", err);
  //       assert.fail(
  //         "The seller should be able to cancel the auction if there are no active bids",
  //       );
  //     }
  //   });

  //   it("should distribute the tokens when a listing closes", async () => {
  //     await sdk.updateSignerOrProvider(adminWallet);
  //     const listingId = (
  //       await marketplaceContract.auction.createListing({
  //         assetContractAddress: dummyNftContract.getAddress(),
  //         buyoutPricePerToken: 10,
  //         currencyContractAddress: tokenAddress,
  //         startTimestamp: new Date(),
  //         listingDurationInSeconds: 60 * 60,
  //         tokenId: "2",
  //         quantity: "1",
  //         reservePricePerToken: 1,
  //       })
  //     ).id;

  //     await sdk.updateSignerOrProvider(bobWallet);

  //     await marketplaceContract.makeOffer(listingId, 2);

  //     await fastForwardTime(60 * 60 * 24);

  //     /**
  //      * Buyer
  //      */
  //     const oldBalance = await dummyNftContract.balanceOf(bobWallet.address);
  //     assert.equal(
  //       oldBalance.toString(),
  //       "0",
  //       "The buyer should have no tokens to start",
  //     );
  //     await marketplaceContract.auction.closeListing(listingId);

  //     const balance = await dummyNftContract.balanceOf(bobWallet.address);
  //     assert.equal(
  //       balance.toString(),
  //       "1",
  //       "The buyer should have been awarded token",
  //     );

  //     /**
  //      * Seller
  //      */
  //     await sdk.updateSignerOrProvider(adminWallet);
  //     const oldTokenBalance = await customTokenContract.balanceOf(
  //       adminWallet.address,
  //     );
  //     assert.deepEqual(
  //       oldTokenBalance.value,
  //       ethers.utils.parseUnits("1000"),
  //       "The buyer should have 1000 tokens to start",
  //     );

  //     await marketplaceContract.auction.closeListing(listingId);

  //     const newTokenBalance = await customTokenContract.balanceOf(
  //       adminWallet.address,
  //     );
  //     assert.deepEqual(
  //       newTokenBalance.value,
  //       ethers.utils
  //         .parseUnits("1000")
  //         // eslint-disable-next-line line-comment-position
  //         .add(ethers.utils.parseUnits("2.00")), // 2% taken out for royalties
  //       // TODO read the fee from the TWFee contract
  //       "The buyer should have two additional tokens after the listing closes",
  //     );
  //   });
  // });

  // describe("Updating listings", () => {
  //   let directListingId: BigNumber;

  //   beforeEach(async () => {
  //     await sdk.updateSignerOrProvider(adminWallet);
  //     directListingId = await createDirectListing(
  //       dummyNftContract.getAddress(),
  //       0,
  //     );
  //   });

  //   it("should allow you to update a direct listing", async () => {
  //     const buyoutPrice = ethers.utils.parseUnits("0.1");

  //     const directListing = await marketplaceContract.direct.getListing(
  //       directListingId,
  //     );
  //     assert.equal(
  //       directListing.buyoutPrice.toString(),
  //       buyoutPrice.toString(),
  //     );

  //     directListing.buyoutPrice = ethers.utils.parseUnits("20");
  //     const block = await hardhatEthers.provider.getBlock("latest");
  //     directListing.startTimeInSeconds = block.timestamp;

  //     await marketplaceContract.direct.updateListing(directListing);

  //     const updatedListing = await marketplaceContract.direct.getListing(
  //       directListingId,
  //     );
  //     assert.equal(
  //       updatedListing.buyoutPrice.toString(),
  //       ethers.utils.parseUnits("20").toString(),
  //     );
  //   });

  //   it("should allow you to update an auction listing", async () => {
  //     const buyoutPrice = ethers.utils.parseUnits("10");

  //     const id = (
  //       await marketplaceContract.auction.createListing({
  //         assetContractAddress: dummyNftContract.getAddress(),
  //         buyoutPricePerToken: 10,
  //         currencyContractAddress: tokenAddress,
  //         // to start tomorrow so we can update it
  //         startTimestamp: new Date(Date.now() + 24 * 60 * 60 * 100000),
  //         listingDurationInSeconds: 60 * 60 * 24,
  //         tokenId: "0",
  //         quantity: 1,
  //         reservePricePerToken: 1,
  //       })
  //     ).id;

  //     const auctionListing = await marketplaceContract.auction.getListing(id);
  //     assert.equal(
  //       auctionListing.buyoutPrice.toString(),
  //       buyoutPrice.toString(),
  //     );

  //     auctionListing.buyoutPrice = ethers.utils.parseUnits("9");

  //     await marketplaceContract.auction.updateListing(auctionListing);

  //     const updatedListing = await marketplaceContract.auction.getListing(id);
  //     assert.equal(
  //       updatedListing.buyoutPrice.toString(),
  //       ethers.utils.parseUnits("9").toString(),
  //     );
  //   });
  // });

  // describe("Utils", async () => {
  //   // TODO rewrite this test to actually try to place bids
  //   it("should return the correct bid buffer rules", async () => {
  //     const testCases: {
  //       winningBid: BigNumberish;
  //       newBid: BigNumberish;
  //       buffer: BigNumberish;
  //       valid: boolean;
  //     }[] = [
  //       {
  //         winningBid: 10,
  //         newBid: 12,
  //         buffer: 500,
  //         valid: true,
  //       },
  //       {
  //         winningBid: 100,
  //         newBid: 101,
  //         buffer: 500,
  //         valid: false,
  //       },
  //       {
  //         winningBid: 10,
  //         newBid: 12,
  //         buffer: 1000,
  //         valid: true,
  //       },
  //       {
  //         winningBid: 10,
  //         newBid: 15,
  //         buffer: 5001,
  //         valid: false,
  //       },
  //       {
  //         winningBid: 10,
  //         newBid: 15,
  //         buffer: 4999,
  //         valid: true,
  //       },
  //       {
  //         winningBid: 10,
  //         newBid: 9,
  //         buffer: 1000,
  //         valid: false,
  //       },
  //     ];

  //     for (const testCase of testCases) {
  //       const result = isWinningBid(
  //         testCase.winningBid,
  //         testCase.newBid,
  //         testCase.buffer,
  //       );
  //       assert.equal(
  //         result,
  //         testCase.valid,
  //         `should be valid: ${JSON.stringify(testCase)}`,
  //       );
  //     }
  //   });
  // });

  // describe("Buffers", () => {
  //   beforeEach(async () => {
  //     await sdk.updateSignerOrProvider(adminWallet);
  //   });

  //   it("should set the correct bid buffer default of 15 minutes", async () => {
  //     const buffer = await marketplaceContract.getTimeBufferInSeconds();
  //     assert.equal(buffer.toNumber(), 15 * 60);
  //   });

  //   it("should set the correct time buffer default of 500 bps", async () => {
  //     const buffer = await marketplaceContract.getBidBufferBps();
  //     assert.equal(buffer.toNumber(), 500);
  //   });

  //   it("should allow you to set the bid buffer", async () => {
  //     await marketplaceContract.setBidBufferBps(1000);
  //     const buffer = await marketplaceContract.getBidBufferBps();
  //     assert.equal(buffer.toNumber(), 1000);
  //   });

  //   it("should allow you to set the time buffer", async () => {
  //     await marketplaceContract.setTimeBufferInSeconds(1000);
  //     const buffer = await marketplaceContract.getTimeBufferInSeconds();
  //     assert.equal(buffer.toNumber(), 1000);
  //   });

  //   it("should calculate the correct bid buffer for a listing without an offer", async () => {
  //     // 10% bid buffer
  //     await marketplaceContract.setBidBufferBps(1000);
  //     // create a listing so we know the listing id
  //     const startTime = new Date();
  //     const reservePricePerToken = 0.05;
  //     const listingId = await createAuctionListing(
  //       dummyNftContract.getAddress(),
  //       2,
  //       1,
  //       startTime,
  //       reservePricePerToken,
  //     );
  //     const minimumNextBid =
  //       await marketplaceContract.auction.getMinimumNextBid(listingId);

  //     assert.equal(
  //       minimumNextBid.displayValue,
  //       // 0.05 + 0.05 * 0.1 = 0.055
  //       "0.055",
  //     );
  //   });

  //   it("should calculate the correct bid buffer for a listing with an offer", async () => {
  //     // 10% bid buffer
  //     await marketplaceContract.setBidBufferBps(1000);
  //     // create a listing so we know the listing id
  //     const startTime = new Date();
  //     const reservePricePerToken = 0.05;
  //     const listingId = await createAuctionListing(
  //       dummyNftContract.getAddress(),
  //       2,
  //       1,
  //       startTime,
  //       reservePricePerToken,
  //     );

  //     // place a bid
  //     sdk.updateSignerOrProvider(samWallet);
  //     await marketplaceContract.makeOffer(listingId, 0.06);

  //     const minimumNextBid =
  //       await marketplaceContract.auction.getMinimumNextBid(listingId);

  //     assert.equal(
  //       minimumNextBid.displayValue,
  //       // 0.06 + 0.06 * 0.1 = 0.066
  //       "0.066",
  //     );
  //   });
  // });

  // describe("Invalid Listings", () => {
  //   let directListingId: BigNumber;

  //   beforeEach(async () => {
  //     await sdk.updateSignerOrProvider(adminWallet);
  //     directListingId = await createDirectListing(
  //       dummyNftContract.getAddress(),
  //       0,
  //     );
  //   });

  //   it("should throw an error when trying to buyout an invalid direct listing", async () => {
  //     await sdk.updateSignerOrProvider(adminWallet);
  //     await dummyNftContract.transfer(samWallet.address, "0");

  //     await sdk.updateSignerOrProvider(bobWallet);

  //     try {
  //       await marketplaceContract.direct.buyoutListing(directListingId, 1);
  //       assert.fail("should have thrown");
  //     } catch (err: any) {}
  //   });

  //   it("should not return invalid direct listings", async () => {
  //     await sdk.updateSignerOrProvider(adminWallet);
  //     await dummyNftContract.transfer(samWallet.address, "0");

  //     const allListings = await marketplaceContract.getActiveListings();
  //     const found = allListings.find(
  //       (l) => l.id.toString() === directListingId.toString(),
  //     );
  //     assert.isUndefined(
  //       found,
  //       "should not have found the listing because it is invalid",
  //     );
  //   });
  // });
});
