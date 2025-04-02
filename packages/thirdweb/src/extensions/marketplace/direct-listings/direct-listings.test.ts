import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
} from "../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { getApprovalForTransaction } from "../../../extensions/erc20/write/getApprovalForTransaction.js";
import { setApprovalForAll as setApprovalForAll721 } from "../../../extensions/erc721/__generated__/IERC721A/write/setApprovalForAll.js";
import { mintTo as mintToErc1155 } from "../../../extensions/erc1155/write/mintTo.js";
import { deployERC20Contract } from "../../../extensions/prebuilts/deploy-erc20.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import { balanceOf as balanceOfErc721 } from "../../erc721/__generated__/IERC721A/read/balanceOf.js";
import { mintTo as mintToErc721 } from "../../erc721/write/mintTo.js";
import { balanceOf as balanceOfErc1155 } from "../../erc1155/__generated__/IERC1155/read/balanceOf.js";
import { setApprovalForAll as setApprovalForAll1155 } from "../../erc1155/__generated__/IERC1155/write/setApprovalForAll.js";
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
import { updateListing } from "./write/updateListing.js";

const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)("Marketplace Direct Listings", () => {
  let marketplaceContract: ThirdwebContract;
  let erc721Contract: ThirdwebContract;
  let erc1155Contract: ThirdwebContract;

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
    const erc721Address = await deployERC721Contract({
      type: "TokenERC721",
      account: TEST_ACCOUNT_B,
      chain,
      client,
      params: {
        name: "TestERC721",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const erc1155Address = await deployERC1155Contract({
      type: "TokenERC1155",
      account: TEST_ACCOUNT_C,
      chain,
      client,
      params: {
        name: "TestERC1155",
        contractURI: TEST_CONTRACT_URI,
      },
    });

    marketplaceContract = getContract({
      address: marketplaceAddress,
      chain,
      client,
    });
    erc721Contract = getContract({
      address: erc721Address,
      chain,
      client,
    });
    erc1155Contract = getContract({
      address: erc1155Address,
      chain,
      client,
    });

    // Mint some NFTs in parallel
    await Promise.all([
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_B,
        transaction: mintToErc721({
          contract: erc721Contract,
          nft: { name: "erc721 #0" },
          to: TEST_ACCOUNT_B.address,
        }),
      }),
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: mintToErc1155({
          contract: erc1155Contract,
          nft: { name: "erc1155 #0" },
          to: TEST_ACCOUNT_C.address,
          supply: 100n,
        }),
      }),
    ]);

    // Set NFT approvals
    await Promise.all([
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_B,
        transaction: setApprovalForAll721({
          contract: erc721Contract,
          approved: true,
          operator: marketplaceAddress,
        }),
      }),
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setApprovalForAll1155({
          contract: erc1155Contract,
          approved: true,
          operator: marketplaceAddress,
        }),
      }),
    ]);
    // ---- set up completed ---- //
  }, 120_000);

  it("should work with ERC721", async () => {
    // listings should be 0 length to start
    const [allListings, totalListingCount] = await Promise.all([
      getAllListings({
        contract: marketplaceContract,
      }),
      totalListings({ contract: marketplaceContract }),
    ]);
    expect(allListings.length).toBe(0);
    // oh and so should totalListings
    expect(totalListingCount).toBe(0n);

    const receipt = await sendAndConfirmTransaction({
      transaction: createListing({
        contract: marketplaceContract,
        assetContractAddress: erc721Contract.address,
        tokenId: 0n,
        pricePerToken: "1",
      }),
      account: TEST_ACCOUNT_B,
    });

    const listingEvents = parseEventLogs({
      events: [newListingEvent()],
      logs: receipt.logs,
    });

    expect(listingEvents.length).toBe(1);

    // biome-ignore lint/style/noNonNullAssertion: OK in tests
    const listingEvent = listingEvents[0]!;

    expect(listingEvent.args.listingCreator).toBe(TEST_ACCOUNT_B.address);
    expect(listingEvent.args.assetContract).toBe(erc721Contract.address);

    const [
      listingsAfter,
      validListings,
      totalListingCount2,
      firstListing,
      nftBalanceOfAccountABeforePurchase,
    ] = await Promise.all([
      getAllListings({
        contract: marketplaceContract,
      }),
      getAllValidListings({
        contract: marketplaceContract,
      }),
      totalListings({ contract: marketplaceContract }),
      getListing({
        contract: marketplaceContract,
        listingId: listingEvent.args.listingId,
      }),
      balanceOfErc721({
        contract: erc721Contract,
        owner: TEST_ACCOUNT_A.address,
      }),
    ]);

    // at this point listings should be 1
    expect(listingsAfter.length).toBe(1);
    // valid listings should also be 1!
    expect(validListings.length).toBe(1);
    // and totalListings should be 1
    expect(totalListingCount2).toBe(1n);
    expect(firstListing).toBeDefined();
    expect(firstListing.status).toBe("ACTIVE");
    expect(firstListing.creatorAddress).toBe(TEST_ACCOUNT_B.address);
    expect(firstListing.assetContractAddress).toBe(erc721Contract.address);
    expect(firstListing.tokenId).toBe(0n);
    expect(firstListing.currencyValuePerToken).toMatchInlineSnapshot(`
    {
      "decimals": 18,
      "displayValue": "1",
      "name": "Anvil Ether",
      "symbol": "ETH",
      "value": 1000000000000000000n,
    }
  `);
    expect(firstListing.asset.metadata.name).toBe("erc721 #0");
    expect(firstListing.asset.id).toBe(0n);
    expect(firstListing.asset.owner).toBe(null);
    // check the listing is valid
    const firstListingValidity = await isListingValid({
      listing: firstListing,
      contract: marketplaceContract,
      quantity: 1n,
    });

    expect(firstListingValidity).toMatchInlineSnapshot(`
    {
      "valid": true,
    }
    `);
    expect(nftBalanceOfAccountABeforePurchase).toBe(0n);

    await sendAndConfirmTransaction({
      transaction: buyFromListing({
        contract: marketplaceContract,
        listingId: listingEvent.args.listingId,
        recipient: TEST_ACCOUNT_A.address,
        quantity: 1n,
      }),
      account: TEST_ACCOUNT_A,
    });

    const [
      nftBalanceOfAccountAAfterPurchase,
      nftBalanceOfAccountBAfterPurchase,
    ] = await Promise.all([
      balanceOfErc721({
        contract: erc721Contract,
        owner: TEST_ACCOUNT_A.address,
      }),
      balanceOfErc721({
        contract: erc721Contract,
        owner: TEST_ACCOUNT_B.address,
      }),
    ]);
    // expect the buyer to have a new balance of 1
    expect(nftBalanceOfAccountAAfterPurchase).toBe(1n);
    // expect the seller to no longer have the nft
    expect(nftBalanceOfAccountBAfterPurchase).toBe(0n);
  }, 120_000);

  it("should work with ERC1155", async () => {
    // this should fail because we're listing more than we have
    await expect(
      sendTransaction({
        transaction: createListing({
          contract: marketplaceContract,
          assetContractAddress: erc1155Contract.address,
          tokenId: 0n,
          pricePerToken: "1",
          quantity: 101n,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [TransactionError: Error - Marketplace: not owner or approved tokens.

      contract: ${marketplaceContract.address}
      chainId: 31337]
    `);

    const receipt1155 = await sendAndConfirmTransaction({
      transaction: createListing({
        contract: marketplaceContract,
        assetContractAddress: erc1155Contract.address,
        tokenId: 0n,
        pricePerToken: "0.01",
        quantity: 1n,
      }),
      account: TEST_ACCOUNT_C,
    });

    const listingEvents1155 = parseEventLogs({
      events: [newListingEvent()],
      logs: receipt1155.logs,
    });

    expect(listingEvents1155.length).toBe(1);

    // biome-ignore lint/style/noNonNullAssertion: OK in tests
    const listingEvent1155 = listingEvents1155[0]!;

    expect(listingEvent1155.args.listingCreator).toBe(TEST_ACCOUNT_C.address);
    expect(listingEvent1155.args.assetContract).toBe(erc1155Contract.address);

    await sendAndConfirmTransaction({
      transaction: updateListing({
        listingId: listingEvent1155.args.listingId,
        contract: marketplaceContract,
        assetContractAddress: erc1155Contract.address,
        tokenId: 0n,
        pricePerToken: "0.05",
        quantity: 1n,
      }),
      account: TEST_ACCOUNT_C,
    });

    const [
      listings1155After,
      validListings1155,
      totalListingCountAfter1155,
      secondListing,
      nft1155BalanceOfAccountABeforePurchase,
    ] = await Promise.all([
      getAllListings({
        contract: marketplaceContract,
      }),
      getAllValidListings({
        contract: marketplaceContract,
      }),
      totalListings({ contract: marketplaceContract }),
      getListing({
        contract: marketplaceContract,
        listingId: listingEvent1155.args.listingId,
      }),
      balanceOfErc1155({
        contract: erc1155Contract,
        owner: TEST_ACCOUNT_A.address,
        tokenId: 0n,
      }),
    ]);

    // at this point listings should be 2
    expect(listings1155After.length).toBe(2);
    // valid listings should be 1 still because the first listing has been bought
    expect(validListings1155.length).toBe(1);
    // and totalListings should be 2
    expect(totalListingCountAfter1155).toBe(2n);
    expect(secondListing).toBeDefined();
    expect(secondListing.status).toBe("ACTIVE");
    expect(secondListing.creatorAddress).toBe(TEST_ACCOUNT_C.address);
    expect(secondListing.assetContractAddress).toBe(erc1155Contract.address);
    expect(secondListing.tokenId).toBe(0n);
    expect(secondListing.currencyValuePerToken).toMatchInlineSnapshot(`
      {
        "decimals": 18,
        "displayValue": "0.05",
        "name": "Anvil Ether",
        "symbol": "ETH",
        "value": 50000000000000000n,
      }
    `);
    expect(secondListing.asset.metadata.name).toBe("erc1155 #0");
    expect(secondListing.asset.id).toBe(0n);

    // check the listing is valid
    const listingValidity = await isListingValid({
      listing: secondListing,
      contract: marketplaceContract,
      quantity: 1n,
    });

    expect(listingValidity).toMatchInlineSnapshot(`
      {
        "valid": true,
      }
    `);

    expect(nft1155BalanceOfAccountABeforePurchase).toBe(0n);

    await sendAndConfirmTransaction({
      transaction: buyFromListing({
        contract: marketplaceContract,
        listingId: listingEvent1155.args.listingId,
        recipient: TEST_ACCOUNT_A.address,
        quantity: 1n,
      }),
      account: TEST_ACCOUNT_A,
    });

    const [
      nft1155BalanceOfAccountAAfterPurchase,
      nft1155BalanceOfAccountCAfterPurchase,
    ] = await Promise.all([
      balanceOfErc1155({
        contract: erc1155Contract,
        owner: TEST_ACCOUNT_A.address,
        tokenId: 0n,
      }),
      balanceOfErc1155({
        contract: erc1155Contract,
        owner: TEST_ACCOUNT_C.address,
        tokenId: 0n,
      }),
    ]);
    // expect the buyer to have a new balance of 1
    expect(nft1155BalanceOfAccountAAfterPurchase).toBe(1n);
    // expect the seller to have one less 1155 token
    expect(nft1155BalanceOfAccountCAfterPurchase).toBe(99n);

    /**
     * buyFromListing transaction (for listing with ERC20 currency) should have proper erc20 value
     * so that getApprovalForTransaction can work properly
     */
    const erc20Address = await deployERC20Contract({
      chain,
      client,
      account: TEST_ACCOUNT_C,
      type: "TokenERC20",
      params: {
        name: "MyToken",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    await sendAndConfirmTransaction({
      transaction: createListing({
        contract: marketplaceContract,
        assetContractAddress: erc1155Contract.address,
        tokenId: 0n,
        pricePerToken: "0.01",
        quantity: 1n,
        currencyContractAddress: erc20Address,
      }),
      account: TEST_ACCOUNT_C,
    });
    // get the last listing id
    const _allListings = await getAllListings({
      contract: marketplaceContract,
    });
    const latestListing = _allListings.at(-1);
    expect(latestListing).toBeDefined();
    if (!latestListing) {
      throw new Error("Cannot get listings");
    }
    const buyListingTx = buyFromListing({
      contract: marketplaceContract,
      listingId: latestListing.id,
      quantity: 1n,
      recipient: TEST_ACCOUNT_C.address,
    });
    expect(await resolvePromisedValue(buyListingTx.erc20Value)).toStrictEqual({
      amountWei: BigInt(1e16),
      tokenAddress: erc20Address,
    });
    const approveTx = await getApprovalForTransaction({
      transaction: buyListingTx,
      account: TEST_ACCOUNT_A,
    });
    expect(approveTx).not.toBe(null);
  }, 120_000);
});
