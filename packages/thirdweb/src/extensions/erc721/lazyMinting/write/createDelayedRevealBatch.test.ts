import { describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_ACCOUNT_D } from "~test/test-wallets.js";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { getContract } from "../../../../contract/contract.js";
import { deployERC721Contract } from "../../../../extensions/prebuilts/deploy-erc721.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { getNFT } from "../../read/getNFT.js";
import { createDelayedRevealBatch } from "./createDelayedRevealBatch.js";
import { reveal } from "./reveal.js";

const placeholderMetadata = {
  description: "Will be revealed next week!",
  name: "Hidden NFT",
};
const account = TEST_ACCOUNT_D;
const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;
const password = "1234";

describe.runIf(process.env.TW_SECRET_KEY)("createDelayedRevealedBatch", () => {
  it("should create delayed-reveal batches properly", async () => {
    const contract = getContract({
      address: await deployERC721Contract({
        account,
        chain,
        client,
        params: {
          contractURI: TEST_CONTRACT_URI,
          name: "nftdrop",
        },
        type: "DropERC721",
      }),
      chain,
      client,
    });

    // Create batch #0
    await sendAndConfirmTransaction({
      account,
      transaction: createDelayedRevealBatch({
        contract,
        metadata: [{ name: "token 0" }, { name: "token 1" }],
        password: "1234",
        placeholderMetadata,
      }),
    });

    // Create batch #1
    await sendAndConfirmTransaction({
      account,
      transaction: createDelayedRevealBatch({
        contract,
        metadata: [{ name: "token 2" }, { name: "token 3" }],
        password,
        placeholderMetadata,
      }),
    });

    // Reveal batch #0
    await sendAndConfirmTransaction({
      account,
      transaction: reveal({ batchId: 0n, contract, password }),
    });
    // Reveal batch #1
    await sendAndConfirmTransaction({
      account,
      transaction: reveal({ batchId: 1n, contract, password }),
    });

    /**
     * The token URIs of batch 0 should end with "/0" and "/1"
     * while the token URIs of batch 1 should end with "/2" and "/3"
     */
    const [token0, token1, token2, token3] = await Promise.all([
      getNFT({ contract, tokenId: 0n }),
      getNFT({ contract, tokenId: 1n }),
      getNFT({ contract, tokenId: 2n }),
      getNFT({ contract, tokenId: 3n }),
    ]);

    expect(token0.tokenURI.endsWith("/0")).toBe(true);
    expect(token0.metadata.name).toBe("token 0");
    expect(token1.tokenURI.endsWith("/1")).toBe(true);
    expect(token1.metadata.name).toBe("token 1");
    expect(token2.tokenURI.endsWith("/2")).toBe(true);
    expect(token2.metadata.name).toBe("token 2");
    expect(token3.tokenURI.endsWith("/3")).toBe(true);
    expect(token3.metadata.name).toBe("token 3");
  });
});
