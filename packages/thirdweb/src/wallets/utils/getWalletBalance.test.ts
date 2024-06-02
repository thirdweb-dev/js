import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { defineChain } from "../../chains/utils.js";
import { getContract } from "../../contract/contract.js";
import { mintTo } from "../../extensions/erc20/write/mintTo.js";
import { deployERC20Contract } from "../../extensions/prebuilts/deploy-erc20.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { getWalletBalance } from "./getWalletBalance.js";

describe.runIf(process.env.TW_SECRET_KEY)("getWalletBalance", () => {
  it("should work for erc20 token", async () => {
    const erc20Address = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "TokenERC20",
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const erc20Contract = getContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      address: erc20Address,
    });

    const amount = 1000;

    // Mint some tokens
    const tx = mintTo({
      contract: erc20Contract,
      to: TEST_ACCOUNT_A.address,
      amount,
    });

    await sendAndConfirmTransaction({
      transaction: tx,
      account: TEST_ACCOUNT_A,
    });

    const result = await getWalletBalance({
      address: TEST_ACCOUNT_A.address,
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      tokenAddress: erc20Address,
    });
    const expectedDecimal = 18;
    expect(result).toBeDefined();
    expect(result.decimals).toBe(expectedDecimal);
    expect(result.symbol).toBeDefined();
    expect(result.name).toBeDefined();
    expect(result.value).toBe(BigInt(amount) * 10n ** BigInt(expectedDecimal));
    expect(result.displayValue).toBe(amount.toString());
  });

  it("should work for un-named token", async () => {
    const result = await getWalletBalance({
      address: TEST_ACCOUNT_A.address,
      client: TEST_CLIENT,
      chain: defineChain(97),
      tokenAddress: "0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378",
    });
    expect(result).toBeDefined();
    expect(result.decimals).toBe(18);
    expect(result.symbol).toBeDefined();
    expect(result.value).toBeGreaterThan(0n);
    expect(result.displayValue).toBeDefined();
  });
});
