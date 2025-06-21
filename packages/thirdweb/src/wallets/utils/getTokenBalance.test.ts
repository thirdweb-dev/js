import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN, FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_D } from "~test/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { mintTo } from "../../extensions/erc20/write/mintTo.js";
import { deployERC20Contract } from "../../extensions/prebuilts/deploy-erc20.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { getTokenBalance } from "./getTokenBalance.js";

const account = TEST_ACCOUNT_D;

describe.runIf(process.env.TW_SECRET_KEY)("getTokenBalance", () => {
  it("should work for native token", async () => {
    const result = await getTokenBalance({
      account,
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
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
      account,
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
      to: account.address,
    });

    await sendAndConfirmTransaction({
      account,
      transaction: tx,
    });

    const result = await getTokenBalance({
      account,
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
});
