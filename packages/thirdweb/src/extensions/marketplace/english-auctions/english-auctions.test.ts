import { type Abi, toFunctionSelector } from "viem";
import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import { resolveContractAbi } from "../../../contract/actions/resolve-abi.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { deployERC20Contract } from "../../../extensions/prebuilts/deploy-erc20.js";
import { eth_getBlockByNumber } from "../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../rpc/rpc.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { approve } from "../../erc721/__generated__/IERC721A/write/approve.js";
import { tokensMintedEvent } from "../../erc721/__generated__/IMintableERC721/events/TokensMinted.js";
import { mintTo } from "../../erc721/write/mintTo.js";
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { deployMarketplaceContract } from "../../prebuilts/deploy-marketplace.js";
import { newAuctionEvent } from "../__generated__/IEnglishAuctions/events/NewAuction.js";
import { getAllAuctions as getAllAuctionsGenerated } from "../__generated__/IEnglishAuctions/read/getAllAuctions.js";
import { totalAuctions } from "../__generated__/IEnglishAuctions/read/totalAuctions.js";
import { mapEnglishAuction } from "../english-auctions/utils.js";
import { getAllInBatches } from "../utils.js";
import { getAllAuctions } from "./read/getAllAuctions.js";
import { getAllValidAuctions } from "./read/getAllValidAuctions.js";
import { getAuction } from "./read/getAuction.js";
import { getWinningBid } from "./read/getWinningBid.js";
import {
  bidInAuction,
  isBidInAuctionSupported,
  prepareBidInAuctionParams,
} from "./write/bidInAuction.js";
import { buyoutAuction } from "./write/buyoutAuction.js";
import {
  createAuction,
  isCreateAuctionSupported,
  prepareCreateAuctionParams,
} from "./write/createAuction.js";

const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)(
  "Marketplace: English Auctions",
  () => {
    let nftTokenId: bigint;
    let marketplaceContract: ThirdwebContract;
    let erc721Contract: ThirdwebContract;
    let erc20Contract: ThirdwebContract;

    beforeAll(async () => {
      const marketplaceAddress = await deployMarketplaceContract({
        account: TEST_ACCOUNT_A,
        chain,
        client,
        params: {
          name: "TestMarketPlace",
          contractURI: TEST_CONTRACT_URI,
        },
      });
      marketplaceContract = getContract({
        address: marketplaceAddress,
        client,
        chain,
      });

      const erc20Address = await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain,
        client,
        params: {
          name: "TestToken",
          symbol: "TSTT",
        },
        type: "TokenERC20",
      });

      erc20Contract = getContract({
        address: erc20Address,
        chain,
        client,
      });

      // also deploy an ERC721 contract
      const erc721Address = await deployERC721Contract({
        type: "TokenERC721",
        account: TEST_ACCOUNT_A,
        chain,
        client,
        params: {
          name: "TestERC721",
          contractURI: TEST_CONTRACT_URI,
        },
      });

      erc721Contract = getContract({
        address: erc721Address,
        client,
        chain,
      });

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
      // does a lot of stuff, this may take a while
    }, 120_000);

    it("getAllValidAuctions should return an empty array if there is no listing", async () => {
      expect(
        await getAllValidAuctions({
          contract: marketplaceContract,
        }),
      ).toStrictEqual([]);
    });

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
      "name": "Anvil Ether",
      "symbol": "ETH",
      "value": 1000000000000000000n,
    }
  `);
      expect(listing.buyoutCurrencyValue).toMatchInlineSnapshot(`
    {
      "decimals": 18,
      "displayValue": "10",
      "name": "Anvil Ether",
      "symbol": "ETH",
      "value": 10000000000000000000n,
    }
  `);
      expect(listing.asset).toMatchInlineSnapshot(`
    {
      "id": 0n,
      "metadata": {
        "name": "Test:ERC721:EnglishAuction",
      },
      "owner": null,
      "tokenURI": "ipfs://QmQSqsA3fJu9dLhBb7FxMf8LxsFtKL3dXzPdQbyEVhGjTF/0",
      "type": "ERC721",
    }
  `);

      // check for a winning bid
      await expect(
        getWinningBid({
          contract: marketplaceContract,
          auctionId: listing.id,
        }),
      ).resolves.toBeUndefined();

      // invalid bid amount 1: 0 bid (0 is not allowed)
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_B,
          transaction: bidInAuction({
            auctionId: listing.id,
            contract: marketplaceContract,
            bidAmount: "0",
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        "[Error: Bid amount is zero]",
      );
      // invalid bid amount 2: 11 bid (over buyout)
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_B,
          transaction: bidInAuction({
            auctionId: listing.id,
            contract: marketplaceContract,
            bidAmount: "11",
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        "[Error: Bid amount is above the buyout amount]",
      );
      // invalid bid amount 3: below minimum bid (but not 0)
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_B,
          transaction: bidInAuction({
            auctionId: listing.id,
            contract: marketplaceContract,
            bidAmount: "0.5",
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        "[Error: Bid amount is below the minimum bid amount]",
      );

      // valid bid amount: "2"
      const _data = await prepareBidInAuctionParams({
        auctionId: listing.id,
        contract: marketplaceContract,
        bidAmount: "2",
      });

      // Should work
      expect(_data).toStrictEqual({
        auctionId: 0n,
        bidAmount: 2000000000000000000n,
        overrides: { value: 2000000000000000000n, extraGas: 50000n },
      });

      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_B,
          transaction: bidInAuction({
            auctionId: listing.id,
            contract: marketplaceContract,
            bidAmount: "2",
          }),
        }),
      ).resolves.toBeDefined();

      // check for a new winning bid
      await expect(
        getWinningBid({
          contract: marketplaceContract,
          auctionId: listing.id,
        }),
      ).resolves.toMatchInlineSnapshot(`
      {
        "bidAmountWei": 2000000000000000000n,
        "bidderAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "currencyAddress": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "currencyValue": {
          "decimals": 18,
          "displayValue": "2",
          "name": "Anvil Ether",
          "symbol": "ETH",
          "value": 2000000000000000000n,
        },
      }
    `);

      // invalid bid amount, above minimum but below existing winning bid
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_B,
          transaction: bidInAuction({
            auctionId: listing.id,
            contract: marketplaceContract,
            bidAmount: "1.5",
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        "[Error: Bid amount is too low to outbid the existing winning bid]",
      );

      // invalid bid amount, above winning bit but below bid + bidBuffer (default 500bps)
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_B,
          transaction: bidInAuction({
            auctionId: listing.id,
            contract: marketplaceContract,
            // 2 * 1.05 = 2.1, so 2.05 is invalid
            bidAmount: "2.05",
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        "[Error: Bid amount is too low to outbid the existing winning bid]",
      );

      // actually outbid the winning bid
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_B,
          transaction: bidInAuction({
            auctionId: listing.id,
            contract: marketplaceContract,
            bidAmount: "3",
          }),
        }),
      ).resolves.toBeDefined();

      // check for a new winning bid
      await expect(
        getWinningBid({
          contract: marketplaceContract,
          auctionId: listing.id,
        }),
      ).resolves.toMatchInlineSnapshot(`
      {
        "bidAmountWei": 3000000000000000000n,
        "bidderAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "currencyAddress": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "currencyValue": {
          "decimals": 18,
          "displayValue": "3",
          "name": "Anvil Ether",
          "symbol": "ETH",
          "value": 3000000000000000000n,
        },
      }
    `);

      // buyout auction
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_B,
          transaction: buyoutAuction({
            contract: marketplaceContract,
            auctionId: listing.id,
          }),
        }),
      ).resolves.toBeDefined();

      // check for a new winning bid
      await expect(
        getWinningBid({
          contract: marketplaceContract,
          auctionId: listing.id,
        }),
      ).resolves.toMatchInlineSnapshot(`
      {
        "bidAmountWei": 10000000000000000000n,
        "bidderAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "currencyAddress": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "currencyValue": {
          "decimals": 18,
          "displayValue": "10",
          "name": "Anvil Ether",
          "symbol": "ETH",
          "value": 10000000000000000000n,
        },
      }
    `);
    });

    it("mapEnglishAuction should work", async () => {
      const rpcClient = getRpcClient(marketplaceContract);
      const [rawAuctions, latestBlock] = await Promise.all([
        getAllInBatches(
          (startId, endId) =>
            getAllAuctionsGenerated({
              contract: marketplaceContract,
              startId,
              endId,
            }),
          {
            start: 0n,
            end: 1n,
            maxSize: 1n,
          },
          // flatten the array of arrays
        ).then((listings) => listings.flat()),
        // get the latest block number once
        eth_getBlockByNumber(rpcClient, {
          blockTag: "latest",
        }),
      ]);
      if (!rawAuctions[0]) {
        throw new Error("Failed to get raw auctions");
      }
      const result = await mapEnglishAuction({
        contract: marketplaceContract,
        rawAuction: rawAuctions[0],
        latestBlock,
      });

      // Difficult to get the precise timestamp, so we'll just do a soft check
      expect(typeof result.startTimeInSeconds).toBe("bigint");
      expect(typeof result.endTimeInSeconds).toBe("bigint");
      expect(result.assetContractAddress).toBe(erc721Contract.address);

      // Remove the timestamp values from the result, then test the rest
      const obj = {
        ...result,
        startTimeInSeconds: 0n,
        endTimeInSeconds: 0n,
        assetContractAddress: "0x",
      };
      expect(obj).toStrictEqual({
        asset: {
          id: 0n,
          metadata: {
            name: "Test:ERC721:EnglishAuction",
          },
          owner: null,
          tokenURI: "ipfs://QmQSqsA3fJu9dLhBb7FxMf8LxsFtKL3dXzPdQbyEVhGjTF/0",
          type: "ERC721",
        },
        assetContractAddress: "0x",
        bidBufferBps: 500n,
        buyoutBidAmount: 10000000000000000000n,
        buyoutCurrencyValue: {
          decimals: 18,
          displayValue: "10",
          name: "Anvil Ether",
          symbol: "ETH",
          value: 10000000000000000000n,
        },
        creatorAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        currencyContractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        endTimeInSeconds: 0n,
        id: 0n,
        minimumBidAmount: 1000000000000000000n,
        minimumBidCurrencyValue: {
          decimals: 18,
          displayValue: "1",
          name: "Anvil Ether",
          symbol: "ETH",
          value: 1000000000000000000n,
        },
        quantity: 1n,
        startTimeInSeconds: 0n,
        status: "ACTIVE",
        timeBufferInSeconds: 900n,
        tokenId: 0n,
        type: "english-auction",
      });
    });

    it("isCreateAuctionSupported should return TRUE for thirdweb marketplace contract", async () => {
      const abi = await resolveContractAbi<Abi>(marketplaceContract);
      const selectors = abi
        .filter((f) => f.type === "function")
        .map((f) => toFunctionSelector(f));
      expect(isCreateAuctionSupported(selectors)).toBe(true);
    });

    it("prepareCreateAuctionParams should produce the correct transaction data for native token", async () => {
      const data = await prepareCreateAuctionParams({
        contract: marketplaceContract,
        assetContractAddress: erc721Contract.address,
        tokenId: nftTokenId,
        minimumBidAmount: "1",
        buyoutBidAmount: "10",
      });

      // Hard to get a precise value for timestamp, so we can do a soft check
      expect(typeof data.params.endTimestamp).toBe("bigint");
      expect(typeof data.params.startTimestamp).toBe("bigint");
      expect(data.overrides).toStrictEqual({ extraGas: 50000n });
      const obj = { ...data.params, startTimestamp: 0n, endTimestamp: 0n };
      expect(obj).toStrictEqual({
        assetContract: erc721Contract.address,
        bidBufferBps: 500n,
        buyoutBidAmount: 10000000000000000000n,
        currency: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        endTimestamp: 0n,
        minimumBidAmount: 1000000000000000000n,
        quantity: 1n,
        startTimestamp: 0n,
        timeBufferInSeconds: 900n,
        tokenId: 0n,
      });
    });

    it("prepareCreateAuctionParams should produce the correct transaction data for ERC20 token", async () => {
      const data = await prepareCreateAuctionParams({
        contract: marketplaceContract,
        assetContractAddress: erc721Contract.address,
        tokenId: nftTokenId,
        minimumBidAmount: "1",
        buyoutBidAmount: "10",
        currencyContractAddress: erc20Contract.address,
      });

      // Hard to get a precise value for timestamp, so we can do a soft check
      expect(typeof data.params.endTimestamp).toBe("bigint");
      expect(typeof data.params.startTimestamp).toBe("bigint");
      expect(data.overrides).toStrictEqual({ extraGas: 50000n });
      const obj = { ...data.params, startTimestamp: 0n, endTimestamp: 0n };
      expect(obj).toStrictEqual({
        assetContract: erc721Contract.address,
        bidBufferBps: 500n,
        buyoutBidAmount: 10000000000000000000n,
        currency: erc20Contract.address,
        endTimestamp: 0n,
        minimumBidAmount: 1000000000000000000n,
        quantity: 1n,
        startTimestamp: 0n,
        timeBufferInSeconds: 900n,
        tokenId: 0n,
      });
    });

    it("prepareCreateAuctionParams should throw error if trying to list an asset that is not 721 or 1155", async () => {
      await expect(() =>
        prepareCreateAuctionParams({
          contract: marketplaceContract,
          assetContractAddress: erc20Contract.address,
          tokenId: nftTokenId,
          minimumBidAmount: "1",
          buyoutBidAmount: "10",
        }),
      ).rejects.toThrowError(
        "AssetContract must implement ERC 1155 or ERC 721.",
      );
    });

    it("prepareCreateAuctionParams should throw error if start auction time is less than endtime", async () => {
      await expect(() =>
        prepareCreateAuctionParams({
          contract: marketplaceContract,
          assetContractAddress: erc721Contract.address,
          tokenId: nftTokenId,
          minimumBidAmount: "1",
          buyoutBidAmount: "10",
          endTimestamp: new Date(135527150873),
        }),
      ).rejects.toThrowError("Start time must be before end time.");
    });

    // it("prepareCreateAuctionParams should default auction quantity to 1n for erc1155 contract", async () => {});

    it("isBidInAuctionSupported should return TRUE for thirdweb marketplace contract", async () => {
      const abi = await resolveContractAbi<Abi>(marketplaceContract);
      const selectors = abi
        .filter((f) => f.type === "function")
        .map((f) => toFunctionSelector(f));
      expect(isBidInAuctionSupported(selectors)).toBe(true);
    });
  },
);
