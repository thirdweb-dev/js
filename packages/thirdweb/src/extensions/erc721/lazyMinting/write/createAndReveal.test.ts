import { beforeAll, describe, it } from "vitest";
import { expect } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { deployERC721Contract } from "../../../prebuilts/deploy-erc721.js";
import { getNFT } from "../../read/getNFT.js";
import { createDelayedRevealBatch } from "./createDelayedRevealBatch.js";
import { reveal } from "./reveal.js";

const placeholderNFT = {
  name: "Hidden NFT",
  description: "Will be revealed next week!",
};

const realNFTs = [
  {
    name: "Common NFT #1",
    description: "Common NFT, one of many.",
  },
  {
    name: "Super Rare NFT #2",
    description: "You got a Super Rare NFT!",
  },
];

describe.runIf(process.env.TW_SECRET_KEY)("createAndReveal", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployERC721Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "DropERC721",
      params: {
        name: "Test NFT",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    contract = getContract({
      chain: ANVIL_CHAIN,
      address,
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
      transaction: tx,
      account: TEST_ACCOUNT_A,
    });
    const nft = await getNFT({
      contract,
      tokenId: 0n,
    });
    expect(nft.metadata.name).toBe(placeholderNFT.name);
    const revealTx = reveal({
      contract,
      batchId: 0n,
      password: "password",
    });
    await sendAndConfirmTransaction({
      transaction: revealTx,
      account: TEST_ACCOUNT_A,
    });
    const nftAfterReveal = await getNFT({
      contract,
      tokenId: 0n,
    });
    expect(nftAfterReveal.metadata.name).toBe(realNFTs[0]?.name);
  });
});
