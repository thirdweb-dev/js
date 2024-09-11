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
        chain,
        client,
        account,
        params: {
          name: "erc20token",
          contractURI: TEST_CONTRACT_URI,
        },
        type: "TokenERC20",
      }),
      client,
      chain,
    });

    await sendAndConfirmTransaction({
      transaction: mintTo({ contract, to: account.address, amount: 1000 }),
      account,
    });

    await sendAndConfirmTransaction({
      transaction: approve({ contract, amount: 999, spender: account.address }),
      account,
    });

    await sendAndConfirmTransaction({
      transaction: transferFrom({
        contract,
        amount: 999,
        to: TEST_ACCOUNT_B.address,
        from: account.address,
      }),
      account,
    });

    const balance = await balanceOf({
      contract,
      address: TEST_ACCOUNT_B.address,
    });
    expect(balance).toBe(999n * 10n ** 18n);
  });

  it("should work with `amountWei`", async () => {
    const contract = getContract({
      address: await deployERC20Contract({
        chain,
        client,
        account,
        params: {
          name: "erc20token",
          contractURI: TEST_CONTRACT_URI,
        },
        type: "TokenERC20",
      }),
      client,
      chain,
    });

    await sendAndConfirmTransaction({
      transaction: mintTo({ contract, to: account.address, amount: 1000 }),
      account,
    });

    await sendAndConfirmTransaction({
      transaction: approve({ contract, amount: 999, spender: account.address }),
      account,
    });

    await sendAndConfirmTransaction({
      transaction: transferFrom({
        contract,
        amountWei: 999n * 10n ** 18n,
        to: TEST_ACCOUNT_B.address,
        from: account.address,
      }),
      account,
    });

    const balance = await balanceOf({
      contract,
      address: TEST_ACCOUNT_B.address,
    });
    expect(balance).toBe(999n * 10n ** 18n);
  });
});
