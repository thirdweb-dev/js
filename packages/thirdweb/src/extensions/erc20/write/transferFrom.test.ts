import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A, TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { deployERC20Contract } from "../../prebuilts/deploy-erc20.js";
import { balanceOf } from "../__generated__/IERC20/read/balanceOf.js";
import { approve } from "./approve.js";
import { mintTo } from "./mintTo.js";
import { transferFrom } from "./transferFrom.js";

const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;
const account = TEST_ACCOUNT_A;

describe.runIf(process.env.TW_SECRET_KEY)("ERC20 transferFrom", () => {
  it("should work with `amount`", async () => {
    const contract = getContract({
      address: await deployERC20Contract({
        account,
        chain,
        client,
        params: {
          contractURI: TEST_CONTRACT_URI,
          name: "erc20token",
        },
        type: "TokenERC20",
      }),
      chain,
      client,
    });

    await sendAndConfirmTransaction({
      account,
      transaction: mintTo({ amount: 1000, contract, to: account.address }),
    });

    await sendAndConfirmTransaction({
      account,
      transaction: approve({ amount: 999, contract, spender: account.address }),
    });

    await sendAndConfirmTransaction({
      account,
      transaction: transferFrom({
        amount: 999,
        contract,
        from: account.address,
        to: TEST_ACCOUNT_B.address,
      }),
    });

    const balance = await balanceOf({
      address: TEST_ACCOUNT_B.address,
      contract,
    });
    expect(balance).toBe(999n * 10n ** 18n);
  });

  it("should work with `amountWei`", async () => {
    const contract = getContract({
      address: await deployERC20Contract({
        account,
        chain,
        client,
        params: {
          contractURI: TEST_CONTRACT_URI,
          name: "erc20token",
        },
        type: "TokenERC20",
      }),
      chain,
      client,
    });

    await sendAndConfirmTransaction({
      account,
      transaction: mintTo({ amount: 1000, contract, to: account.address }),
    });

    await sendAndConfirmTransaction({
      account,
      transaction: approve({ amount: 999, contract, spender: account.address }),
    });

    await sendAndConfirmTransaction({
      account,
      transaction: transferFrom({
        amountWei: 999n * 10n ** 18n,
        contract,
        from: account.address,
        to: TEST_ACCOUNT_B.address,
      }),
    });

    const balance = await balanceOf({
      address: TEST_ACCOUNT_B.address,
      contract,
    });
    expect(balance).toBe(999n * 10n ** 18n);
  });
});
