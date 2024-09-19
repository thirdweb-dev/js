import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";

import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { getContract } from "../../../../contract/contract.js";
import { deployERC1155Contract } from "../../../../extensions/prebuilts/deploy-erc1155.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { getNFTs } from "../../read/getNFTs.js";
import { lazyMint } from "../../write/lazyMint.js";
import { updateMetadata } from "./updateMetadata.js";

const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;
describe.runIf(process.env.TW_SECRET_KEY)("updateMetadata ERC1155", () => {
  it("should update metadata", async () => {
    const address = await deployERC1155Contract({
      client,
      chain,
      account,
      type: "DropERC1155",
      params: {
        name: "Edition Drop",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({
      address,
      client,
      chain,
    });
    const lazyMintTx = lazyMint({
      contract,
      nfts: [{ name: "token 0" }, { name: "token 1" }, { name: "token 2" }],
    });
    await sendAndConfirmTransaction({ transaction: lazyMintTx, account });

    const updateTx = updateMetadata({
      contract,
      targetTokenId: 1n,
      newMetadata: { name: "token 1 - updated" },
    });
    await sendAndConfirmTransaction({ transaction: updateTx, account });

    const nfts = await getNFTs({ contract });

    expect(nfts.length).toBe(3);
    expect(nfts[0]?.metadata.name).toBe("token 0");
    expect(nfts[1]?.metadata.name).toBe("token 1 - updated");
    expect(nfts[2]?.metadata.name).toBe("token 2");
  });
});
