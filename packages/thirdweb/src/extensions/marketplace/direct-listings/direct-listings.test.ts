import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { balanceOf as balanceOfErc721 } from "../../erc721/__generated__/IERC721A/read/balanceOf.js";
import { approve as approveErc721 } from "../../erc721/__generated__/IERC721A/write/approve.js";
import { tokensMintedEvent as tokensMintedEventErc721 } from "../../erc721/__generated__/IMintableERC721/events/TokensMinted.js";
import { mintTo as mintToErc721 } from "../../erc721/write/mintTo.js";
import { balanceOf as balanceOfErc1155 } from "../../erc1155/__generated__/IERC1155/read/balanceOf.js";
import { setApprovalForAll } from "../../erc1155/__generated__/IERC1155/write/setApprovalForAll.js";
import { claimTo } from "../../erc1155/drops/write/claimTo.js";
import { setClaimConditions } from "../../erc1155/drops/write/setClaimConditions.js";
import { lazyMint } from "../../erc1155/write/lazyMint.js";
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { deployERC1155Contract } from "../../prebuilts/deploy-erc1155.js";
import { deployMarketplaceContract } from "../../prebuilts/deploy-marketplace.js";
import { newListingEvent } from "../__generated__/IDirectListings/events/NewListing.js";
import { totalListings } from "../__generated__/IDirectListings/read/totalListings.js";
import { getAllListings } from "./read/getAllListings.js";
import { getAllValidListings } from "./read/getAllValidListings.js";
import { getListing } from "./read/getListing.js";
import { isListingValid } from "./utils.js";
import { buyFromListing } from "./write/buyFromListing.js";
import { createListing } from "./write/createListing.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "Marketplace: Direct Listings",
  () => {
    describe("ERC721", () => {
      let nftTokenId: bigint;
      let marketplaceContract: ThirdwebContract;
      let erc721Contract: ThirdwebContract;
      beforeAll(async () => {
        marketplaceContract = getContract({
          address: await deployMarketplaceContract({
            account: TEST_ACCOUNT_A,
            chain: ANVIL_CHAIN,
            client: TEST_CLIENT,
            params: {
              name: "TestMarketPlace",
            },
          }),
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
        });

        // also deploy an ERC721 contract
        erc721Contract = getContract({
          address: await deployERC721Contract({
            type: "TokenERC721",
            account: TEST_ACCOUNT_A,
            chain: ANVIL_CHAIN,
            client: TEST_CLIENT,
            params: {
              name: "TestERC721",
            },
          }),
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
        });

        const receipt = await sendAndConfirmTransaction({
          transaction: mintToErc721({
            contract: erc721Contract,
            to: TEST_ACCOUNT_A.address,
            nft: { name: "Test:ERC721:DirectListing" },
          }),
          account: TEST_ACCOUNT_A,
        });

        const mintEvents = parseEventLogs({
          events: [tokensMintedEventErc721()],
          logs: receipt.logs,
        });

        expect(mintEvents.length).toBe(1);
        expect(mintEvents[0]?.args.tokenIdMinted).toBeDefined();

        nftTokenId = mintEvents[0]?.args.tokenIdMinted as bigint;
        // does a lot of stuff, this may take a while
      }, 120_000);

      it("should work for basic listings (Native Currency)", async () => {
        // listings should be 0 length to start
        const listings = await getAllListings({
          contract: marketplaceContract,
        });
        expect(listings.length).toBe(0);
        // oh and so should totalListings
        expect(await totalListings({ contract: marketplaceContract })).toBe(0n);

        // approve first
        const approveTx = approveErc721({
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
        "name": "Anvil Ether",
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

        // check the listing is valid
        const listingValidity = await isListingValid({
          listing,
          contract: marketplaceContract,
          quantity: 1n,
        });

        expect(listingValidity).toMatchInlineSnapshot(`
      {
        "valid": true,
      }
    `);

        // expect the buyer to have an initial balance of 0
        await expect(
          balanceOfErc721({
            contract: erc721Contract,
            owner: TEST_ACCOUNT_B.address,
          }),
        ).resolves.toBe(0n);

        const buyTx = buyFromListing({
          contract: marketplaceContract,
          listingId: listingEvent.args.listingId,
          recipient: TEST_ACCOUNT_B.address,
          quantity: 1n,
        });

        await sendAndConfirmTransaction({
          transaction: buyTx,
          account: TEST_ACCOUNT_B,
        });

        // expect the buyer to have a new balance of 1
        await expect(
          balanceOfErc721({
            contract: erc721Contract,
            owner: TEST_ACCOUNT_B.address,
          }),
        ).resolves.toBe(1n);
        // expect the seller to no longer have the token
        await expect(
          balanceOfErc721({
            contract: erc721Contract,
            owner: TEST_ACCOUNT_A.address,
          }),
        ).resolves.toBe(0n);
      });
    });

    describe("ERC1155 Drop", () => {
      let nftTokenId: bigint;
      let marketplaceContract: ThirdwebContract;
      let erc1155Contract: ThirdwebContract;
      beforeAll(async () => {
        marketplaceContract = getContract({
          address: await deployMarketplaceContract({
            account: TEST_ACCOUNT_A,
            chain: ANVIL_CHAIN,
            client: TEST_CLIENT,
            params: {
              name: "TestMarketPlace",
            },
          }),
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
        });

        // also deploy an ERC721 contract
        erc1155Contract = getContract({
          address: await deployERC1155Contract({
            type: "DropERC1155",
            account: TEST_ACCOUNT_A,
            chain: ANVIL_CHAIN,
            client: TEST_CLIENT,
            params: {
              name: "TestERC1155",
            },
          }),
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
        });

        // lazy mint 10 tokens
        await expect(
          sendAndConfirmTransaction({
            transaction: lazyMint({
              contract: erc1155Contract,
              nfts: [{ name: "Test:ERC1155:DirectListing" }],
            }),
            account: TEST_ACCOUNT_A,
          }),
        ).resolves.toBeDefined();

        // set claim condition (just public is fine)
        await expect(
          sendAndConfirmTransaction({
            transaction: setClaimConditions({
              contract: erc1155Contract,
              tokenId: 0n,
              phases: [{}],
            }),
            account: TEST_ACCOUNT_A,
          }),
        ).resolves.toBeDefined();

        // claim 10 tokens
        await expect(
          sendAndConfirmTransaction({
            transaction: claimTo({
              contract: erc1155Contract,
              tokenId: 0n,
              to: TEST_ACCOUNT_A.address,
              quantity: 10n,
            }),
            account: TEST_ACCOUNT_A,
          }),
        ).resolves.toBeDefined();

        nftTokenId = 0n;
        // does a lot of stuff, this may take a while
      }, 120_000);

      it("should work for basic listings (Native Currency)", async () => {
        // listings should be 0 length to start
        const listings = await getAllListings({
          contract: marketplaceContract,
        });
        expect(listings.length).toBe(0);
        // oh and so should totalListings
        expect(await totalListings({ contract: marketplaceContract })).toBe(0n);

        // approve first

        await sendAndConfirmTransaction({
          transaction: setApprovalForAll({
            contract: erc1155Contract,
            operator: marketplaceContract.address,
            approved: true,
          }),
          account: TEST_ACCOUNT_A,
        });

        // this should fail because we're listing more than we have
        await expect(
          sendAndConfirmTransaction({
            transaction: createListing({
              contract: marketplaceContract,
              assetContractAddress: erc1155Contract.address,
              tokenId: nftTokenId,
              pricePerToken: "1",
              quantity: 20n,
            }),
            account: TEST_ACCOUNT_A,
          }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [TransactionError: Error - Marketplace: not owner or approved tokens.

        contract: ${marketplaceContract.address}
        chainId: 31337]
      `);

        // this should work because we're listing the correct amount
        const receipt = await sendAndConfirmTransaction({
          transaction: createListing({
            contract: marketplaceContract,
            assetContractAddress: erc1155Contract.address,
            tokenId: nftTokenId,
            pricePerToken: "0.01",
            quantity: 1n,
          }),
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
        expect(listingEvent.args.assetContract).toBe(erc1155Contract.address);

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
        expect(listing.assetContractAddress).toBe(erc1155Contract.address);
        expect(listing.tokenId).toBe(nftTokenId);
        expect(listing.currencyValuePerToken).toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "0.01",
          "name": "Anvil Ether",
          "symbol": "ETH",
          "value": 10000000000000000n,
        }
      `);
        expect(listing.asset).toMatchInlineSnapshot(`
        {
          "id": 0n,
          "metadata": {
            "name": "Test:ERC1155:DirectListing",
          },
          "owner": null,
          "supply": 10n,
          "tokenURI": "ipfs://QmdwzcoSGSzoRSMBk2efkHjGVRsyUaR2Lm79YTuL324NtM/0",
          "type": "ERC1155",
        }
      `);

        // check the listing is valid
        const listingValidity = await isListingValid({
          listing,
          contract: marketplaceContract,
          quantity: 1n,
        });

        expect(listingValidity).toMatchInlineSnapshot(`
        {
          "valid": true,
        }
      `);

        // expect the buyer to have an initial balance of 0
        await expect(
          balanceOfErc1155({
            contract: erc1155Contract,
            owner: TEST_ACCOUNT_B.address,
            tokenId: nftTokenId,
          }),
        ).resolves.toBe(0n);

        const buyTx = buyFromListing({
          contract: marketplaceContract,
          listingId: listingEvent.args.listingId,
          recipient: TEST_ACCOUNT_B.address,
          quantity: 1n,
        });

        await sendAndConfirmTransaction({
          transaction: buyTx,
          account: TEST_ACCOUNT_B,
        });

        // expect the buyer to have a new balance of 1
        await expect(
          balanceOfErc1155({
            contract: erc1155Contract,
            owner: TEST_ACCOUNT_B.address,
            tokenId: nftTokenId,
          }),
        ).resolves.toBe(1n);
        // expect the seller to only have 9 of the tokens
        await expect(
          balanceOfErc1155({
            contract: erc1155Contract,
            owner: TEST_ACCOUNT_A.address,
            tokenId: nftTokenId,
          }),
        ).resolves.toBe(9n);
      });
    });
  },
);
