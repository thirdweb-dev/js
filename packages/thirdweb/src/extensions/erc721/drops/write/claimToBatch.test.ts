import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
  TEST_ACCOUNT_D,
} from "~test/test-wallets.js";
import { getContract } from "../../../../contract/contract.js";
import { deployERC721Contract } from "../../../../extensions/prebuilts/deploy-erc721.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { getNFTs } from "../../read/getNFTs.js";
import { lazyMint } from "../../write/lazyMint.js";
import { claimToBatch, optimizeClaimContent } from "./claimToBatch.js";
import { setClaimConditions } from "./setClaimConditions.js";

const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;
const account = TEST_ACCOUNT_A;

describe.runIf(process.env.TW_SECRET_KEY)("erc721: claimToBatch", () => {
  it("should optimize the claim content", () => {
    expect(
      optimizeClaimContent([
        {
          quantity: 1n,
          to: account.address,
        },
        {
          quantity: 2n,
          to: TEST_ACCOUNT_B.address,
        },
        {
          quantity: 3n,
          to: TEST_ACCOUNT_B.address,
        },
        { quantity: 2n, to: TEST_ACCOUNT_C.address },
        { quantity: 2n, to: TEST_ACCOUNT_D.address },
        { quantity: 1n, to: account.address },
      ]),
    ).toStrictEqual([
      { quantity: 1n, to: account.address },
      { quantity: 5n, to: TEST_ACCOUNT_B.address },
      { quantity: 2n, to: TEST_ACCOUNT_C.address },
      { quantity: 2n, to: TEST_ACCOUNT_D.address },
      { quantity: 1n, to: account.address },
    ]);
  });

  it("should claim in batch", async () => {
    const address = await deployERC721Contract({
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "Test DropERC721",
      },
      type: "DropERC721",
    });

    const contract = getContract({
      address,
      chain,
      client,
    });

    await sendAndConfirmTransaction({
      account,
      transaction: lazyMint({
        contract,
        nfts: [
          { name: "Test NFT 0" },
          { name: "Test NFT 1" },
          { name: "Test NFT 2" },
          { name: "Test NFT 3" },
          { name: "Test NFT 4" },
          { name: "Test NFT 5" },
          { name: "Test NFT 6" },
          { name: "Test NFT 7" },
          { name: "Test NFT 8" },
          { name: "Test NFT 9" },
          { name: "Test NFT 10" },
        ],
      }),
    });

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: setClaimConditions({
        contract,
        phases: [{}],
      }),
    });

    const transaction = claimToBatch({
      content: [
        {
          quantity: 1n,
          to: account.address,
        },
        {
          quantity: 2n,
          to: TEST_ACCOUNT_B.address,
        },
        {
          quantity: 3n,
          to: TEST_ACCOUNT_B.address,
        },
        { quantity: 2n, to: TEST_ACCOUNT_C.address },
        { quantity: 2n, to: TEST_ACCOUNT_D.address },
        { quantity: 1n, to: account.address },
      ],
      contract,
      from: account.address,
    });

    await sendAndConfirmTransaction({ account, transaction });

    const nfts = await getNFTs({ contract, includeOwners: true });
    expect(nfts.length).toBe(11);
    expect(nfts[0]?.owner?.toLowerCase()).toBe(account.address.toLowerCase());
    expect(nfts[1]?.owner?.toLowerCase()).toBe(
      TEST_ACCOUNT_B.address.toLowerCase(),
    );
    expect(nfts[2]?.owner?.toLowerCase()).toBe(
      TEST_ACCOUNT_B.address.toLowerCase(),
    );
    expect(nfts[3]?.owner?.toLowerCase()).toBe(
      TEST_ACCOUNT_B.address.toLowerCase(),
    );
    expect(nfts[4]?.owner?.toLowerCase()).toBe(
      TEST_ACCOUNT_B.address.toLowerCase(),
    );
    expect(nfts[5]?.owner?.toLowerCase()).toBe(
      TEST_ACCOUNT_B.address.toLowerCase(),
    );
    expect(nfts[6]?.owner?.toLowerCase()).toBe(
      TEST_ACCOUNT_C.address.toLowerCase(),
    );
    expect(nfts[7]?.owner?.toLowerCase()).toBe(
      TEST_ACCOUNT_C.address.toLowerCase(),
    );
    expect(nfts[8]?.owner?.toLowerCase()).toBe(
      TEST_ACCOUNT_D.address.toLowerCase(),
    );
    expect(nfts[9]?.owner?.toLowerCase()).toBe(
      TEST_ACCOUNT_D.address.toLowerCase(),
    );
    expect(nfts[10]?.owner?.toLowerCase()).toBe(account.address.toLowerCase());
  });
});
