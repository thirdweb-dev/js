import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { getDeployedInfraContract } from "../../../contract/deployment/utils/infra.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getBalance } from "../../erc20/read/getBalance.js";
import { approve as approveErc20 } from "../../erc20/write/approve.js";
import { deposit } from "../../erc20/write/deposit.js";
import { ownerOf } from "../../erc721/__generated__/IERC721A/read/ownerOf.js";
import { approve as approveErc721 } from "../../erc721/__generated__/IERC721A/write/approve.js";
import { tokensMintedEvent } from "../../erc721/__generated__/IMintableERC721/events/TokensMinted.js";
import { mintTo } from "../../erc721/write/mintTo.js";
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { deployMarketplaceContract } from "../../prebuilts/deploy-marketplace.js";
import { newOfferEvent } from "../__generated__/IOffers/events/NewOffer.js";
import { totalOffers } from "../__generated__/IOffers/read/totalOffers.js";
import { cancelOffer } from "../__generated__/IOffers/write/cancelOffer.js";
import { getAllOffers } from "./read/getAllOffers.js";
import { getAllValidOffers } from "./read/getAllValidOffers.js";
import { getOffer } from "./read/getOffer.js";
import { acceptOffer } from "./write/acceptOffer.js";
import { makeOffer } from "./write/makeOffer.js";

describe.skip("Marketplace: Offers", () => {
  let nftTokenId: bigint;
  let marketplaceContract: ThirdwebContract;
  let erc721Contract: ThirdwebContract;
  let WETH9: ThirdwebContract;
  beforeAll(async () => {
    const marketplaceAddress = await deployMarketplaceContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "TestMarketPlace",
      },
    });
    marketplaceContract = getContract({
      address: marketplaceAddress,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    // also deploy an ERC721 contract
    const erc721Address = await deployERC721Contract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "TestERC721",
      },
      type: "TokenERC721",
    });

    erc721Contract = getContract({
      address: erc721Address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const mintTransaction = mintTo({
      contract: erc721Contract,
      nft: { name: "Test:ERC721:Offers" },
      to: TEST_ACCOUNT_A.address,
    });
    const receipt = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: mintTransaction,
    });

    const mintEvents = parseEventLogs({
      events: [tokensMintedEvent()],
      logs: receipt.logs,
    });

    expect(mintEvents.length).toBe(1);
    expect(mintEvents[0]?.args.tokenIdMinted).toBeDefined();

    nftTokenId = mintEvents[0]?.args.tokenIdMinted as bigint;

    // biome-ignore lint/style/noNonNullAssertion: test only and we know it will exist here because it gets deployed in the beforeAll
    WETH9 = (await getDeployedInfraContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      contractId: "WETH9",
    }))!;

    expect(WETH9.address).toMatchInlineSnapshot(
      `"0x81e609b897393731a3d23c1d311330340cebb9e9"`,
    );
    // does a lot of stuff, this may take a while
  }, 120_000);

  // NOTE: this test suite relies on the order of operations in order to not re-deploy contracts over and over
  // this is generally not ideal, but we're doing it here to save time

  it("should start out with 0 offers", async () => {
    await expect(totalOffers({ contract: marketplaceContract })).resolves.toBe(
      0n,
    );
    await expect(
      getAllOffers({ contract: marketplaceContract }),
    ).resolves.toMatchInlineSnapshot("[]");
    await expect(
      getAllValidOffers({ contract: marketplaceContract }),
    ).resolves.toMatchInlineSnapshot("[]");
  });

  it("should allow a user to create an offer", async () => {
    // first deposit some tokens into the WETH9 contract
    // do do that, determine the address of the WETH9 contract

    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_B,
        transaction: deposit({ amount: "10", contract: WETH9 }),
      }),
    ).resolves.toBeDefined();

    // check to make sure the weth9 balance is correct
    await expect(
      getBalance({ address: TEST_ACCOUNT_B.address, contract: WETH9 }),
    ).resolves.toMatchInlineSnapshot(`
      {
        "decimals": 18,
        "displayValue": "10",
        "name": "Wrapped Ether",
        "symbol": "WETH",
        "value": 10000000000000000000n,
      }
    `);

    // now approve the marketplace contract to spend the WETH9 tokens
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_B,
        transaction: approveErc20({
          amount: "10",
          contract: WETH9,
          spender: marketplaceContract.address,
        }),
      }),
    ).resolves.toBeDefined();

    // now create an offer
    const receipt = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_B,
      transaction: makeOffer({
        assetContractAddress: erc721Contract.address,
        contract: marketplaceContract,
        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
        offerExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        tokenId: nftTokenId,
        totalOffer: "1",
      }),
    });
    expect(receipt).toBeDefined();

    const [eventLog] = parseEventLogs({
      events: [newOfferEvent()],
      logs: receipt.logs,
    });
    expect(eventLog).toBeDefined();
    expect(eventLog?.args.offer.assetContract).toBe(erc721Contract.address);
    expect(eventLog?.args.offer.tokenId).toBe(nftTokenId);
    expect(eventLog?.args.offer.offeror).toBe(TEST_ACCOUNT_B.address);
  });

  it("should have 1 offer", async () => {
    await expect(totalOffers({ contract: marketplaceContract })).resolves.toBe(
      1n,
    );
    await expect(
      getAllOffers({ contract: marketplaceContract }),
    ).resolves.toHaveLength(1);
    await expect(
      getAllValidOffers({ contract: marketplaceContract }),
    ).resolves.resolves.toHaveLength(1);
    const offer = await getOffer({
      contract: marketplaceContract,
      offerId: 0n,
    });
    expect(offer.status).toMatchInlineSnapshot(`"ACTIVE"`);
    expect(offer.assetContractAddress).toBe(erc721Contract.address);
    expect(offer.tokenId).toBe(nftTokenId);
    expect(offer.offerorAddress).toBe(TEST_ACCOUNT_B.address);
    expect(offer.asset).toMatchInlineSnapshot(`
      {
        "id": 0n,
        "metadata": {
          "name": "Test:ERC721:Offers",
        },
        "owner": null,
        "tokenURI": "ipfs://QmRk3sj4XxUx61SxBxt24uPJXDCf1G9G6iHAJgM6tbAuwD/0",
        "type": "ERC721",
      }
    `);
    expect(offer.currencyValue).toMatchInlineSnapshot(`
      {
        "decimals": 18,
        "displayValue": "1",
        "name": "Wrapped Ether",
        "symbol": "WETH",
        "value": 1000000000000000000n,
      }
    `);
  });

  it("should allow a user to cancel an offer", async () => {
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_B,
        transaction: cancelOffer({
          contract: marketplaceContract,
          offerId: 0n,
        }),
      }),
    ).resolves.toBeDefined();
    await expect(totalOffers({ contract: marketplaceContract })).resolves.toBe(
      1n,
    );
    await expect(
      getAllOffers({ contract: marketplaceContract }),
    ).resolves.toHaveLength(1);
    // valid offers should be 0
    await expect(
      getAllValidOffers({ contract: marketplaceContract }),
    ).resolves.resolves.toHaveLength(0);
    const offer = await getOffer({
      contract: marketplaceContract,
      offerId: 0n,
    });
    expect(offer.status).toMatchInlineSnapshot(`"CANCELLED"`);

    // should no longer be able to accept the offer
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_B,
        transaction: acceptOffer({
          contract: marketplaceContract,
          offerId: 0n,
        }),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      "[Error: Offer is not active]",
    );
  });

  it("should allow an offer to be accepted", async () => {
    // first gotta create a new offer
    // thankfully we already have the WETH9 tokens approved and ready to go
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_B,
        transaction: makeOffer({
          assetContractAddress: erc721Contract.address,
          contract: marketplaceContract,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          offerExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          tokenId: nftTokenId,
          // 2 WETH this time!
          totalOffer: "2",
        }),
      }),
    ).resolves.toBeDefined();

    // check for the new offer
    await expect(totalOffers({ contract: marketplaceContract })).resolves.toBe(
      2n,
    );
    await expect(
      getAllOffers({ contract: marketplaceContract }),
    ).resolves.toHaveLength(2);
    await expect(
      getAllValidOffers({ contract: marketplaceContract }),
      // should only have 1 valid offer!
    ).resolves.resolves.toHaveLength(1);
    const offer = await getOffer({
      contract: marketplaceContract,
      offerId: 1n,
    });
    expect(offer.status).toMatchInlineSnapshot(`"ACTIVE"`);

    // have to approve the marketplace contract to control the NFT!
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: approveErc721({
          contract: erc721Contract,
          to: marketplaceContract.address,
          tokenId: nftTokenId,
        }),
      }),
    ).resolves.toBeDefined();

    // now we accept the offer!
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: acceptOffer({
          contract: marketplaceContract,
          offerId: 1n,
        }),
      }),
    ).resolves.toBeDefined();

    // check the balances
    await expect(
      getBalance({ address: TEST_ACCOUNT_A.address, contract: WETH9 }),
    ).resolves.toMatchInlineSnapshot(`
      {
        "decimals": 18,
        "displayValue": "2",
        "name": "Wrapped Ether",
        "symbol": "WETH",
        "value": 2000000000000000000n,
      }
    `);
    await expect(
      getBalance({ address: TEST_ACCOUNT_B.address, contract: WETH9 }),
    ).resolves.toMatchInlineSnapshot(`
      {
        "decimals": 18,
        "displayValue": "8",
        "name": "Wrapped Ether",
        "symbol": "WETH",
        "value": 8000000000000000000n,
      }
    `);
    // check the owner of the NFT
    await expect(
      ownerOf({ contract: erc721Contract, tokenId: nftTokenId }),
    ).resolves.toBe(TEST_ACCOUNT_B.address);
  });
});
