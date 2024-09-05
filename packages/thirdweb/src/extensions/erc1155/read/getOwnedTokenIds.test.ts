import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { deployERC1155Contract } from "../../prebuilts/deploy-erc1155.js";
import { mintTo } from "../write/mintTo.js";
import { getOwnedTokenIds } from "./getOwnedTokenIds.js";

const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe.runIf(process.env.TW_SECRET_KEY)("ERC1155 getOwnedTokenIds", () => {
  it("should fetch owned tokenIds", async () => {
    const address = await deployERC1155Contract({
      type: "TokenERC1155",
      chain,
      client,
      account,
      params: {
        name: "edition",
        contractURI: TEST_CONTRACT_URI,
      },
    });

    const contract = getContract({
      address,
      chain,
      client,
    });

    const transaction = mintTo({
      contract,
      nft: { name: "token 0" },
      to: account.address,
      supply: 20n,
    });
    await sendAndConfirmTransaction({ transaction, account });

    const ownedTokenIds = await getOwnedTokenIds({
      contract,
      address: account.address,
    });

    expect(ownedTokenIds).toStrictEqual([{ tokenId: 0n, balance: 20n }]);
  });
});
