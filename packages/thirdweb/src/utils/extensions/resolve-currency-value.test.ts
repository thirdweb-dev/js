import { describe, expect, it } from "vitest";
import { FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { USDT_CONTRACT_ADDRESS } from "~test/test-contracts.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { resolveCurrencyValue } from "./resolve-currency-value.js";

const client = TEST_CLIENT;
const chain = FORKED_ETHEREUM_CHAIN;

describe.runIf(process.env.TW_SECRET_KEY)("Resolve currency value", () => {
  it("should work with native token", async () => {
    const data = await resolveCurrencyValue({
      client,
      chain,
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      wei: 18n,
    });

    expect(data).toStrictEqual({
      name: "Ether",
      decimals: 18,
      symbol: "ETH",
      displayValue: "0.000000000000000018",
      value: 18n,
    });
  });

  it("should work with ERC20 token", async () => {
    const data = await resolveCurrencyValue({
      client,
      chain,
      currencyAddress: USDT_CONTRACT_ADDRESS,
      wei: 18n,
    });
    expect(data).toStrictEqual({
      name: "Tether USD",
      decimals: 6,
      symbol: "USDT",
      displayValue: "0.000018",
      value: 18n,
    });
  });
});
