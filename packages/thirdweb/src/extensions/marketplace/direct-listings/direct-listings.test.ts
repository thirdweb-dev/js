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
  getContract,
  type ThirdwebContract,
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
        contractURI: TEST_CONTRACT_URI,
        name: "TestMarketPlace",
      },
    });
    const erc721Address = await deployERC721Contract({
      account: TEST_ACCOUNT_B,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "TestERC721",
      },
      type: "TokenERC721",
    });
    const erc1155Address = await deployERC1155Contract({
      account: TEST_ACCOUNT_C,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "TestERC1155",
      },
      type: "TokenERC1155",
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
          supply: 100n,
          to: TEST_ACCOUNT_C.address,
        }),
      }),
    ]);

    // Set NFT approvals
    await Promise.all([
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_B,
        transaction: setApprovalForAll721({
          approved: true,
          contract: erc721Contract,
          operator: marketplaceAddress,
        }),
      }),
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setApprovalForAll1155({
          approved: true,
          contract: erc1155Contract,
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
      account: TEST_ACCOUNT_B,
      transaction: createListing({
        assetContractAddress: erc721Contract.address,
        contract: marketplaceContract,
        pricePerToken: "1",
        tokenId: 0n,
      }),
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
    expect(firstListing.currencyValuePerToken.displayValue).toBe("1");
    expect(firstListing.asset.metadata.name).toBe("erc721 #0");
    expect(firstListing.asset.id).toBe(0n);
    expect(firstListing.asset.owner).toBe(null);
    // check the listing is valid
    const firstListingValidity = await isListingValid({
      contract: marketplaceContract,
      listing: firstListing,
      quantity: 1n,
    });

    expect(firstListingValidity).toMatchInlineSnapshot(`
    {
      "valid": true,
    }
    `);
    expect(nftBalanceOfAccountABeforePurchase).toBe(0n);

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: buyFromListing({
        contract: marketplaceContract,
        listingId: listingEvent.args.listingId,
        quantity: 1n,
        recipient: TEST_ACCOUNT_A.address,
      }),
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
        account: TEST_ACCOUNT_C,
        transaction: createListing({
          assetContractAddress: erc1155Contract.address,
          contract: marketplaceContract,
          pricePerToken: "1",
          quantity: 101n,
          tokenId: 0n,
        }),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [TransactionError: Error - Marketplace: not owner or approved tokens.

      contract: ${marketplaceContract.address}
      chainId: 31337]
    `);

    const receipt1155 = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_C,
      transaction: createListing({
        assetContractAddress: erc1155Contract.address,
        contract: marketplaceContract,
        pricePerToken: "0.01",
        quantity: 1n,
        tokenId: 0n,
      }),
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
      account: TEST_ACCOUNT_C,
      transaction: updateListing({
        assetContractAddress: erc1155Contract.address,
        contract: marketplaceContract,
        listingId: listingEvent1155.args.listingId,
        pricePerToken: "0.05",
        quantity: 1n,
        tokenId: 0n,
      }),
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
    expect(secondListing.currencyValuePerToken.displayValue).toBe("0.05");
    expect(secondListing.asset.metadata.name).toBe("erc1155 #0");
    expect(secondListing.asset.id).toBe(0n);

    // check the listing is valid
    const listingValidity = await isListingValid({
      contract: marketplaceContract,
      listing: secondListing,
      quantity: 1n,
    });

    expect(listingValidity).toMatchInlineSnapshot(`
      {
        "valid": true,
      }
    `);

    expect(nft1155BalanceOfAccountABeforePurchase).toBe(0n);

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: buyFromListing({
        contract: marketplaceContract,
        listingId: listingEvent1155.args.listingId,
        quantity: 1n,
        recipient: TEST_ACCOUNT_A.address,
      }),
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
      account: TEST_ACCOUNT_C,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "MyToken",
      },
      type: "TokenERC20",
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_C,
      transaction: createListing({
        assetContractAddress: erc1155Contract.address,
        contract: marketplaceContract,
        currencyContractAddress: erc20Address,
        pricePerToken: "0.01",
        quantity: 1n,
        tokenId: 0n,
      }),
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
      account: TEST_ACCOUNT_A,
      transaction: buyListingTx,
    });
    expect(approveTx).not.toBe(null);
  }, 120_000);
});
