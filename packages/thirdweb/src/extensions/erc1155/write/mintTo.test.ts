import {} from "viem";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_C } from "~test/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { deployERC1155Contract } from "../../../extensions/prebuilts/deploy-erc1155.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { uri } from "../__generated__/IERC1155/read/uri.js";
import { mintTo } from "./mintTo.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc1155: mintTo", () => {
  it("should mint with `nft` being declared as a string", async () => {
    const contract = getContract({
      address: await deployERC1155Contract({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "",
          contractURI: TEST_CONTRACT_URI,
        },
        type: "TokenERC1155",
        account: TEST_ACCOUNT_C,
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    await sendAndConfirmTransaction({
      transaction: mintTo({
        contract,
        nft: TEST_CONTRACT_URI,
        to: TEST_ACCOUNT_C.address,
        supply: 1n,
      }),
      account: TEST_ACCOUNT_C,
    });

    const tokenUri = await uri({ contract, tokenId: 0n });
    expect(tokenUri).toBe(TEST_CONTRACT_URI);
  });
});
