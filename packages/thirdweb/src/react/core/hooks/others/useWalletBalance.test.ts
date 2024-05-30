import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../../../contract/contract.js";
import { mintTo } from "../../../../extensions/erc20/write/mintTo.js";
import { deployERC20Contract } from "../../../../extensions/prebuilts/deploy-erc20.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { useWalletBalance } from "./useWalletBalance.js";

describe.runIf(process.env.TW_SECRET_KEY)("useWalletBalance", () => {
  it("should return the correct balance", async () => {
    const erc20Address = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "TokenERC20",
      params: {
        name: "Token",
      },
    });
    const erc20Contract = getContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      address: erc20Address,
    });

    // Mint some tokens
    const tx = mintTo({
      contract: erc20Contract,
      to: TEST_ACCOUNT_A.address,
      amount: 1000,
    });

    await sendAndConfirmTransaction({
      transaction: tx,
      account: TEST_ACCOUNT_A,
    });

    const { result } = renderHook(() =>
      useWalletBalance({
        chain: ANVIL_CHAIN,
        address: TEST_ACCOUNT_A.address,
        client: TEST_CLIENT,
      }),
    );

    expect(result.current.data).toBe(1000n);
  });
});
