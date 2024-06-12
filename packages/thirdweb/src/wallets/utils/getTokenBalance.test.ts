import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN, FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { mintTo } from "../../extensions/erc20/write/mintTo.js";
import { deployERC20Contract } from "../../extensions/prebuilts/deploy-erc20.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { getTokenBalance } from "./getTokenBalance.js";

describe.runIf(process.env.TW_SECRET_KEY)("getTokenBalance", () => {
  it("should work for native token", async () => {
    const result = await getTokenBalance({
      account: TEST_ACCOUNT_A,
      client: TEST_CLIENT,
      chain: FORKED_ETHEREUM_CHAIN,
    });

    expect(result).toStrictEqual({
      decimals: 18,
      displayValue: "10000",
      name: "Ether",
      symbol: "ETH",
      value: 10000000000000000000000n,
    });
  });

  it("should work for ERC20 token", async () => {
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

    const result = await getTokenBalance({
      client: TEST_CLIENT,
      account: TEST_ACCOUNT_A,
      tokenAddress: erc20Address,
      chain: ANVIL_CHAIN,
    });

    const expectedDecimal = 18;
    expect(result).toBeDefined();
    expect(result.decimals).toBe(expectedDecimal);
    expect(result.symbol).toBeDefined();
    expect(result.name).toBeDefined();
    expect(result.value).toBe(BigInt(amount) * 10n ** BigInt(expectedDecimal));
    expect(result.displayValue).toBe(amount.toString());
  });
});
