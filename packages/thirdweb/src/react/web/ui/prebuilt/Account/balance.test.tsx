import { describe, expect, it } from "vitest";
import { VITALIK_WALLET } from "~test/addresses.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import {
  formatAccountFiatBalance,
  formatAccountTokenBalance,
  loadAccountBalance,
} from "./balance.js";

describe.runIf(process.env.TW_SECRET_KEY)("AccountBalance component", () => {
  it("`loadAccountBalance` should fetch the native balance properly", async () => {
    const result = await loadAccountBalance({
      client: TEST_CLIENT,
      chain: ethereum,
      address: VITALIK_WALLET,
    });

    expect(Number.isNaN(result.balance)).toBe(false);
    expect(result.symbol).toBe("ETH");
  });

  it("`loadAccountBalance` should fetch the token balance properly", async () => {
    const result = await loadAccountBalance({
      client: TEST_CLIENT,
      chain: ethereum,
      address: VITALIK_WALLET,
      // USDC
      tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    });

    expect(Number.isNaN(result.balance)).toBe(false);
    expect(result.symbol).toBe("USDC");
  });

  it("`loadAccountBalance` should fetch the fiat balance properly", async () => {
    const result = await loadAccountBalance({
      client: TEST_CLIENT,
      chain: ethereum,
      address: VITALIK_WALLET,
      showInFiat: "USD",
    });

    expect(Number.isNaN(result.balance)).toBe(false);
    expect(result.symbol).toBe("$");
  });

  it("`loadAccountBalance` should throw if `chain` is not passed", async () => {
    await expect(() =>
      loadAccountBalance({ client: TEST_CLIENT, address: VITALIK_WALLET }),
    ).rejects.toThrowError("chain is required");
  });

  it("`loadAccountBalance` should throw if `tokenAddress` is mistakenly passed as native token", async () => {
    await expect(() =>
      loadAccountBalance({
        client: TEST_CLIENT,
        address: VITALIK_WALLET,
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        chain: ethereum,
      }),
    ).rejects.toThrowError(
      `Invalid tokenAddress - cannot be ${NATIVE_TOKEN_ADDRESS}`,
    );
  });

  it("`loadAccountBalance` should throw if `address` is not a valid evm address", async () => {
    await expect(() =>
      loadAccountBalance({
        client: TEST_CLIENT,
        address: "haha",
        chain: ethereum,
      }),
    ).rejects.toThrowError("Invalid wallet address. Expected an EVM address");
  });

  it("`loadAccountBalance` should throw if `tokenAddress` is passed but is not a valid evm address", async () => {
    await expect(() =>
      loadAccountBalance({
        client: TEST_CLIENT,
        address: VITALIK_WALLET,
        tokenAddress: "haha",
        chain: ethereum,
      }),
    ).rejects.toThrowError(
      "Invalid tokenAddress. Expected an EVM contract address",
    );
  });

  it("`formatAccountTokenBalance` should display a rounded-up value + symbol", () => {
    expect(
      formatAccountTokenBalance({
        balance: 1.1999,
        symbol: "ETH",
        decimals: 1,
      }),
    ).toBe("1.2 ETH");
  });

  it("`formatAccountFiatBalance` should display fiat symbol followed by a rounded-up fiat value", () => {
    expect(
      formatAccountFiatBalance({ balance: 55.001, symbol: "$", decimals: 0 }),
    ).toBe("$55");
  });
});
