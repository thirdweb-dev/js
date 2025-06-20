import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../../test/src/test-wallets.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { deployERC721Contract } from "../../../prebuilts/deploy-erc721.js";
import { getNFT } from "../../read/getNFT.js";
import { createDelayedRevealBatch } from "./createDelayedRevealBatch.js";
import { reveal } from "./reveal.js";

const placeholderNFT = {
  description: "Will be revealed next week!",
  name: "Hidden NFT",
};

const realNFTs = [
  {
    description: "Common NFT, one of many.",
    name: "Common NFT #1",
  },
  {
    description: "You got a Super Rare NFT!",
    name: "Super Rare NFT #2",
  },
];

describe.runIf(process.env.TW_SECRET_KEY)("createAndReveal", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployERC721Contract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "Test NFT",
      },
      type: "DropERC721",
    });
    contract = getContract({
      address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  });

  it("should create and reveal a batch", async () => {
    const tx = createDelayedRevealBatch({
      contract,
      metadata: realNFTs,
      password: "password",
      placeholderMetadata: placeholderNFT,
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: tx,
    });
    const nft = await getNFT({
      contract,
      tokenId: 0n,
    });
    expect(nft.metadata.name).toBe(placeholderNFT.name);
    const revealTx = reveal({
      batchId: 0n,
      contract,
      password: "password",
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: revealTx,
    });
    const nftAfterReveal = await getNFT({
      contract,
      tokenId: 0n,
    });
    expect(nftAfterReveal.metadata.name).toBe(realNFTs[0]?.name);
  });
});
