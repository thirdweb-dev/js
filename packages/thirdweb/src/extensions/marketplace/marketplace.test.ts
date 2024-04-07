import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { parseEventLogs } from "../../event/actions/parse-logs.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { getContractMetadata } from "../common/read/getContractMetadata.js";
import { approve } from "../erc721/__generated__/IERC721A/write/approve.js";
import { tokensMintedEvent } from "../erc721/__generated__/IMintableERC721/events/TokensMinted.js";
import { mintTo } from "../erc721/write/mintTo.js";
import { deployERC721Contract } from "../prebuilts/deploy-erc721.js";
import { deployMarketplaceContract } from "../prebuilts/deploy-marketplace.js";
import { newListingEvent } from "./__generated__/IDirectListings/events/NewListing.js";
import { totalListings } from "./__generated__/IDirectListings/read/totalListings.js";
import { newAuctionEvent } from "./__generated__/IEnglishAuctions/events/NewAuction.js";
import { totalAuctions } from "./__generated__/IEnglishAuctions/read/totalAuctions.js";
import { getAllListings } from "./read/direct/getAllListings.js";
import { getAllValidListings } from "./read/direct/getAllValidListings.js";
import { getListing } from "./read/direct/getListing.js";
import { getAllAuctions } from "./read/english-auction/getAllAuctions.js";
import { getAllValidAuctions } from "./read/english-auction/getAllValidAuctions.js";
import { getAuction } from "./read/english-auction/getAuction.js";
import { createListing } from "./write/direct/createListing.js";
import { createAuction } from "./write/english-auction/createAuction.js";

describe.runIf(process.env.TW_SECRET_KEY)("Marketplace", () => {
  let marketplaceContract: ThirdwebContract;
  let erc721Contract: ThirdwebContract;

  beforeAll(async () => {
    const marketplaceAddress = await deployMarketplaceContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "TestMarketPlace",
      },
    });
    marketplaceContract = getContract({
      address: marketplaceAddress,
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
    });

    // also deploy an ERC721 contract
    const erc721Address = await deployERC721Contract({
      type: "TokenERC721",
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "TestERC721",
      },
    });

    erc721Contract = getContract({
      address: erc721Address,
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
    });

    // does a lot of stuff, this may take a while
  }, 60_000);

  describe("Deployment", () => {
    it("should deploy marketplace contract", () => {
      expect(marketplaceContract).toBeDefined();
    });
    it("should have the correct name", async () => {
      const metadata = await getContractMetadata({
        contract: marketplaceContract,
      });
      expect(metadata.name).toBe("TestMarketPlace");
    });
  });

  describe("Direct Listings", () => {
    let nftTokenId: bigint;
    beforeAll(async () => {
      const mintTransaction = mintTo({
        contract: erc721Contract,
        to: TEST_ACCOUNT_A.address,
        nft: { name: "Test:ERC721:DirectListing" },
      });
      const receipt = await sendAndConfirmTransaction({
        transaction: mintTransaction,
        account: TEST_ACCOUNT_A,
      });

      const mintEvents = parseEventLogs({
        events: [tokensMintedEvent()],
        logs: receipt.logs,
      });

      expect(mintEvents.length).toBe(1);
      expect(mintEvents[0]?.args.tokenIdMinted).toBeDefined();

      nftTokenId = mintEvents[0]?.args.tokenIdMinted as bigint;
    }, 30_000);

    it("should work for basic listings (Native Currency)", async () => {
      // listings should be 0 length to start
      const listings = await getAllListings({
        contract: marketplaceContract,
      });
      expect(listings.length).toBe(0);
      // oh and so should totalListings
      expect(await totalListings({ contract: marketplaceContract })).toBe(0n);

      // approve first
      const approveTx = approve({
        contract: erc721Contract,
        to: marketplaceContract.address,
        tokenId: nftTokenId,
      });

      await sendAndConfirmTransaction({
        transaction: approveTx,
        account: TEST_ACCOUNT_A,
      });

      const transaction = createListing({
        contract: marketplaceContract,
        assetContractAddress: erc721Contract.address,
        tokenId: nftTokenId,
        pricePerToken: "1",
      });
      const receipt = await sendAndConfirmTransaction({
        transaction,
        account: TEST_ACCOUNT_A,
      });

      const listingEvents = parseEventLogs({
        events: [newListingEvent()],
        logs: receipt.logs,
      });

      expect(listingEvents.length).toBe(1);

      // biome-ignore lint/style/noNonNullAssertion: OK in tests
      const listingEvent = listingEvents[0]!;

      expect(listingEvent.args.listingCreator).toBe(TEST_ACCOUNT_A.address);
      expect(listingEvent.args.assetContract).toBe(erc721Contract.address);

      // at this point listings should be 1
      const listingsAfter = await getAllListings({
        contract: marketplaceContract,
      });
      expect(listingsAfter.length).toBe(1);
      // valid listings should also be 1!
      const validListings = await getAllValidListings({
        contract: marketplaceContract,
      });
      expect(validListings.length).toBe(1);
      // and totalListings should be 1
      expect(await totalListings({ contract: marketplaceContract })).toBe(1n);

      // explicitly retrieve the listing!
      const listing = await getListing({
        contract: marketplaceContract,
        listingId: listingEvent.args.listingId,
      });

      expect(listing).toBeDefined();
      expect(listing.status).toBe("ACTIVE");
      expect(listing.creatorAddress).toBe(TEST_ACCOUNT_A.address);
      expect(listing.assetContractAddress).toBe(erc721Contract.address);
      expect(listing.tokenId).toBe(nftTokenId);
      expect(listing.currencyValuePerToken).toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "1",
          "name": "Ether",
          "symbol": "ETH",
          "value": 1000000000000000000n,
        }
      `);
      expect(listing.asset).toMatchInlineSnapshot(`
        {
          "id": 0n,
          "metadata": {
            "name": "Test:ERC721:DirectListing",
          },
          "owner": null,
          "tokenURI": "ipfs://QmewoGwuooC1Vno1ZTnmKmEUaimDygraR1fEEHdTeraF34/0",
          "type": "ERC721",
        }
      `);
    });
  });

  describe("English Auctions", () => {
    let nftTokenId: bigint;
    beforeAll(async () => {
      const mintTransaction = mintTo({
        contract: erc721Contract,
        to: TEST_ACCOUNT_A.address,
        nft: { name: "Test:ERC721:EnglishAuction" },
      });
      const receipt = await sendAndConfirmTransaction({
        transaction: mintTransaction,
        account: TEST_ACCOUNT_A,
      });

      const mintEvents = parseEventLogs({
        events: [tokensMintedEvent()],
        logs: receipt.logs,
      });

      expect(mintEvents.length).toBe(1);
      expect(mintEvents[0]?.args.tokenIdMinted).toBeDefined();

      nftTokenId = mintEvents[0]?.args.tokenIdMinted as bigint;
    }, 30_000);

    it("should work for basic auctions (Native Currency)", async () => {
      // auctions should be 0 length to start
      const auctions = await getAllAuctions({
        contract: marketplaceContract,
      });
      expect(auctions.length).toBe(0);
      // oh and so should totalAuctions
      expect(await totalAuctions({ contract: marketplaceContract })).toBe(0n);

      // approve first
      const approveTx = approve({
        contract: erc721Contract,
        to: marketplaceContract.address,
        tokenId: nftTokenId,
      });

      await sendAndConfirmTransaction({
        transaction: approveTx,
        account: TEST_ACCOUNT_A,
      });

      const transaction = createAuction({
        contract: marketplaceContract,
        assetContractAddress: erc721Contract.address,
        tokenId: nftTokenId,
        minimumBidAmount: "1",
        buyoutBidAmount: "10",
      });
      const receipt = await sendAndConfirmTransaction({
        transaction,
        account: TEST_ACCOUNT_A,
      });

      const listingEvents = parseEventLogs({
        events: [newAuctionEvent()],
        logs: receipt.logs,
      });

      expect(listingEvents.length).toBe(1);

      // biome-ignore lint/style/noNonNullAssertion: OK in tests
      const listingEvent = listingEvents[0]!;

      expect(listingEvent.args.auctionCreator).toBe(TEST_ACCOUNT_A.address);
      expect(listingEvent.args.assetContract).toBe(erc721Contract.address);

      // at this point auctions should be 1
      const auctionsAfter = await getAllAuctions({
        contract: marketplaceContract,
      });
      expect(auctionsAfter.length).toBe(1);
      // valid auctions should also be 1!
      const validAuctions = await getAllValidAuctions({
        contract: marketplaceContract,
      });
      expect(validAuctions.length).toBe(1);
      // and totalauctions should be 1
      expect(await totalAuctions({ contract: marketplaceContract })).toBe(1n);

      // explicitly retrieve the listing!
      const listing = await getAuction({
        contract: marketplaceContract,
        auctionId: listingEvent.args.auctionId,
      });

      expect(listing).toBeDefined();
      expect(listing.status).toBe("ACTIVE");
      expect(listing.creatorAddress).toBe(TEST_ACCOUNT_A.address);
      expect(listing.assetContractAddress).toBe(erc721Contract.address);
      expect(listing.tokenId).toBe(nftTokenId);
      expect(listing.minimumBidCurrencyValue).toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "1",
          "name": "Ether",
          "symbol": "ETH",
          "value": 1000000000000000000n,
        }
      `);
      expect(listing.buyoutCurrencyValue).toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "10",
          "name": "Ether",
          "symbol": "ETH",
          "value": 10000000000000000000n,
        }
      `);
      expect(listing.asset).toMatchInlineSnapshot(`
        {
          "id": 1n,
          "metadata": {
            "name": "Test:ERC721:EnglishAuction",
          },
          "owner": null,
          "tokenURI": "ipfs://QmQSqsA3fJu9dLhBb7FxMf8LxsFtKL3dXzPdQbyEVhGjTF/0",
          "type": "ERC721",
        }
      `);
    });
  });
});
