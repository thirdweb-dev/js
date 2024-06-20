import { beforeEach, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";

import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { deployERC1155Contract } from "../../../../extensions/prebuilts/deploy-erc1155.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import type { NFTInput } from "../../../../utils/nft/parseNft.js";
import { getNFT } from "../../read/getNFT.js";
import { getNFTs } from "../../read/getNFTs.js";
import { lazyMint } from "../../write/lazyMint.js";
import { getUpdateMetadataParams, updateMetadata } from "./updateMetadata.js";

let contract: ThirdwebContract;
const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe.runIf(process.env.TW_SECRET_KEY)("erc1155: updateMetadata", () => {
  beforeEach(async () => {
    const address = await deployERC1155Contract({
      client,
      chain,
      account,
      type: "DropERC1155",
      params: {
        name: "EditionDrop",
      },
    });
    contract = getContract({
      address,
      client,
      chain,
    });
  });

  it("should update the metadata for the selected token | case 1", async () => {
    const metadatas: NFTInput[] = [
      { name: "token 0" },
      { name: "token 1" },
      { name: "token 2" },
    ];

    const lazyMintTx = lazyMint({ contract, nfts: metadatas });
    await sendAndConfirmTransaction({ transaction: lazyMintTx, account });

    const transaction = updateMetadata({
      contract,
      targetTokenId: 0n,
      newMetadata: { name: "token 0 - updated" },
      client,
    });
    await sendAndConfirmTransaction({ transaction, account });
    const nfts = await getNFTs({ contract });
    expect(nfts[0]?.metadata.name).toBe("token 0 - updated");

    // The other tokens should not change
    expect(nfts[1]?.metadata.name).toBe("token 1");
    expect(nfts[2]?.metadata.name).toBe("token 2");
  });

  it("should update the metadata for the selected token | case 2", async () => {
    const nftBatch1: NFTInput[] = [
      { name: "token 0" },
      { name: "token 1" },
      { name: "token 2" },
    ];

    const batch1 = lazyMint({ contract, nfts: nftBatch1 });
    await sendAndConfirmTransaction({ transaction: batch1, account });

    const nftBatch2: NFTInput[] = [
      { name: "token 3" },
      { name: "token 4" },
      { name: "token 5" },
    ];
    const batch2 = lazyMint({ contract, nfts: nftBatch2 });
    await sendAndConfirmTransaction({ transaction: batch2, account });

    // firstly, update the token in the first batch
    const transaction1 = updateMetadata({
      contract,
      targetTokenId: 0n,
      newMetadata: { name: "token 0 - updated" },
      client,
    });
    await sendAndConfirmTransaction({ transaction: transaction1, account });
    const nft = await getNFT({ contract, tokenId: 0n });
    expect(nft.metadata.name).toBe("token 0 - updated");

    const tokenUriAfterUpdatedFirstTime = nft.tokenURI;

    // Update token in the second batch
    const transaction2 = updateMetadata({
      contract,
      targetTokenId: 5n,
      newMetadata: { name: "token 5 - updated" },
      client,
    });
    await sendAndConfirmTransaction({ transaction: transaction2, account });

    const allNfts = await getNFTs({ contract });
    expect(allNfts[0]?.metadata.name).toBe("token 0 - updated");
    expect(allNfts.at(-1)?.metadata.name).toBe("token 5 - updated");

    // The tokenUri of tokenId#0 after the second updateMetadata should still be the same
    // since it belong to another batch
    expect(allNfts[0]?.tokenURI).toBe(tokenUriAfterUpdatedFirstTime);
  });

  it("should throw error if there's no batch", async () => {
    await expect(() =>
      getUpdateMetadataParams({
        contract,
        targetTokenId: 0n,
        newMetadata: { name: "token 0 - updated" },
        client,
      }),
    ).rejects.toThrowError(
      "No base URI set. Please set a base URI before updating metadata",
    );
  });
});
