import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_C } from "~test/test-wallets.js";
import { getContract } from "../../../../contract/contract.js";
import { deployERC721Contract } from "../../../../extensions/prebuilts/deploy-erc721.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { getNFTs } from "../../read/getNFTs.js";
import { lazyMint } from "../../write/lazyMint.js";
import { updateMetadata } from "./updateMetadata.js";

const account = TEST_ACCOUNT_C;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe.runIf(process.env.TW_SECRET_KEY)("updateMetadata ERC721", () => {
  it("should update metadata", async () => {
    const address = await deployERC721Contract({
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "NFT Drop",
      },
      type: "DropERC721",
    });
    const contract = getContract({
      address,
      chain,
      client,
    });
    const lazyMintTx = lazyMint({
      contract,
      nfts: [{ name: "token 0" }, { name: "token 1" }, { name: "token 2" }],
    });
    await sendAndConfirmTransaction({ account, transaction: lazyMintTx });

    const updateTx = updateMetadata({
      contract,
      newMetadata: { name: "token 1 - updated" },
      targetTokenId: 1n,
    });
    await sendAndConfirmTransaction({ account, transaction: updateTx });

    const nfts = await getNFTs({ contract });

    expect(nfts.length).toBe(3);
    expect(nfts[0]?.metadata.name).toBe("token 0");
    expect(nfts[1]?.metadata.name).toBe("token 1 - updated");
    expect(nfts[2]?.metadata.name).toBe("token 2");
  });

  it("should throw if no nft uploaded", async () => {
    const address = await deployERC721Contract({
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "NFT Drop",
      },
      type: "DropERC721",
    });
    const contract = getContract({
      address,
      chain,
      client,
    });
    const updateTx = updateMetadata({
      contract,
      newMetadata: { name: "token 1 - updated" },
      targetTokenId: 0n,
    });
    await expect(
      sendAndConfirmTransaction({ account, transaction: updateTx }),
    ).rejects.toThrowError(
      "No base URI set. Please set a base URI before updating metadata",
    );
  });

  it(
    "should handle very large batch",
    {
      timeout: 600000,
    },
    async () => {
      const address = await deployERC721Contract({
        account,
        chain,
        client,
        params: {
          contractURI: TEST_CONTRACT_URI,
          name: "NFT Drop",
        },
        type: "DropERC721",
      });
      const contract = getContract({
        address,
        chain,
        client,
      });
      const lazyMintTx = lazyMint({
        contract,
        nfts: Array.from({ length: 1000 }, (_, i) => ({
          name: `token ${i}`,
        })),
      });
      await sendAndConfirmTransaction({ account, transaction: lazyMintTx });
      const updateTx = updateMetadata({
        contract,
        newMetadata: { name: "token 1 - updated" },
        targetTokenId: 1n,
      });
      await sendAndConfirmTransaction({ account, transaction: updateTx });
      const nfts = await getNFTs({ contract });

      expect(nfts.length).toBe(100); // first page
      expect(nfts[0]?.metadata.name).toBe("token 0");
      expect(nfts[1]?.metadata.name).toBe("token 1 - updated");
      expect(nfts[2]?.metadata.name).toBe("token 2");
    },
  );
});
