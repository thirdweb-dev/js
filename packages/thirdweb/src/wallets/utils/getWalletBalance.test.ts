import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { mintTo } from "../../extensions/erc20/write/mintTo.js";
import { deployERC20Contract } from "../../extensions/prebuilts/deploy-erc20.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { getWalletBalance } from "./getWalletBalance.js";

describe.runIf(process.env.TW_SECRET_KEY)("getWalletBalance", () => {
  it("should work for erc20 token", async () => {
    const erc20Address = await deployERC20Contract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "",
      },
      type: "TokenERC20",
    });
    const erc20Contract = getContract({
      address: erc20Address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const amount = 1000;

    // Mint some tokens
    const tx = mintTo({
      amount,
      contract: erc20Contract,
      to: TEST_ACCOUNT_A.address,
    });

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: tx,
    });

    const result = await getWalletBalance({
      address: TEST_ACCOUNT_A.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
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

  it("should work for native currency", async () => {
    const result = await getWalletBalance({
      address: TEST_ACCOUNT_A.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
    expect(result).toBeDefined();
    expect(result.decimals).toBe(18);
    expect(result.symbol).toBeDefined();
    expect(result.value).toBeGreaterThan(0n);
    expect(result.displayValue).toBeDefined();
  });
});
