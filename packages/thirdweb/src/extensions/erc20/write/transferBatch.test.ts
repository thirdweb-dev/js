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
import { getContract } from "../../../contract/contract.js";
import { deployERC20Contract } from "../../../extensions/prebuilts/deploy-erc20.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { balanceOf } from "../__generated__/IERC20/read/balanceOf.js";
import { mintTo } from "./mintTo.js";
import { transferBatch } from "./transferBatch.js";

const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;
const account = TEST_ACCOUNT_A;

describe("erc20: transferBatch", () => {
  it("should transfer tokens to multiple recipients", async () => {
    const address = await deployERC20Contract({
      type: "TokenERC20",
      account,
      chain,
      client,
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({
      address,
      chain,
      client,
    });

    // Mint 100 tokens
    await sendAndConfirmTransaction({
      transaction: mintTo({ contract, to: account.address, amount: 100 }),
      account,
    });

    // Send 25 tokens to each account B, C and D
    await sendAndConfirmTransaction({
      account,
      transaction: transferBatch({
        contract,
        batch: [
          {
            to: TEST_ACCOUNT_B.address,
            amount: 25,
          },
          {
            to: TEST_ACCOUNT_C.address,
            amount: 25,
          },
          {
            to: TEST_ACCOUNT_D.address,
            amount: 25,
          },
        ],
      }),
    });

    // After that, each address A, B, C and D should have 25 tokens
    const [balanceA, balanceB, balanceC, balanceD] = await Promise.all([
      balanceOf({ contract, address: TEST_ACCOUNT_A.address }),
      balanceOf({ contract, address: TEST_ACCOUNT_B.address }),
      balanceOf({ contract, address: TEST_ACCOUNT_C.address }),
      balanceOf({ contract, address: TEST_ACCOUNT_D.address }),
    ]);

    expect(balanceA).toBe(25n * 10n ** 18n);
    expect(balanceB).toBe(25n * 10n ** 18n);
    expect(balanceC).toBe(25n * 10n ** 18n);
    expect(balanceD).toBe(25n * 10n ** 18n);
  });
});
