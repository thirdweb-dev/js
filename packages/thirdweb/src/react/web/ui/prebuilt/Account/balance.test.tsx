import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { VITALIK_WALLET } from "~test/addresses.js";
import { render } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { sepolia } from "../../../../../chains/chain-definitions/sepolia.js";
import { defineChain } from "../../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { AccountProvider } from "../../../../core/account/provider.js";
import {
  formatAccountFiatBalance,
  formatAccountTokenBalance,
  loadAccountBalance,
} from "../../../../core/utils/account.js";
import { AccountBalance } from "./balance.js";

const queryClient = new QueryClient();

describe.runIf(process.env.TW_SECRET_KEY)("AccountBalance component", () => {
  it("should render", async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={TEST_CLIENT}>
          <AccountBalance
            chain={ethereum}
            loadingComponent={<span />}
            fallbackComponent={<span />}
            formatFn={() => "nope"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );

    const spans = container.getElementsByTagName("span");
    expect(spans).toHaveLength(1);
  });

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
      showBalanceInFiat: "USD",
    });

    expect(Number.isNaN(result.balance)).toBe(false);
    expect(result.symbol).toBe("$");
  });

  it("`loadAccountBalance` should throw if `tokenAddress` is mistakenly passed as native token", async () => {
    await expect(
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
    await expect(
      loadAccountBalance({
        client: TEST_CLIENT,
        // biome-ignore lint/suspicious/noExplicitAny: for the test
        address: "haha" as any,
        chain: ethereum,
      }),
    ).rejects.toThrowError("Invalid wallet address. Expected an EVM address");
  });

  it("`loadAccountBalance` should throw if `tokenAddress` is passed but is not a valid evm address", async () => {
    await expect(
      loadAccountBalance({
        client: TEST_CLIENT,
        address: VITALIK_WALLET,
        // biome-ignore lint/suspicious/noExplicitAny: for the test
        tokenAddress: "haha" as any,
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

  it("`loadAccountBalance` should throw if failed to load tokenBalance (native token)", async () => {
    await expect(
      loadAccountBalance({
        client: TEST_CLIENT,
        address: VITALIK_WALLET,
        chain: defineChain(-1),
      }),
    ).rejects.toThrowError(
      `Failed to retrieve native token balance for address: ${VITALIK_WALLET} on chainId:-1`,
    );
  });

  it("`loadAccountBalance` should throw if failed to load tokenBalance (erc20 token)", async () => {
    await expect(
      loadAccountBalance({
        client: TEST_CLIENT,
        address: VITALIK_WALLET,
        chain: defineChain(-1),
        tokenAddress: "0xFfEBd97b29AD3b2BecF8E554e4a638A56C6Bbd59",
      }),
    ).rejects.toThrowError(
      `Failed to retrieve token: 0xFfEBd97b29AD3b2BecF8E554e4a638A56C6Bbd59 balance for address: ${VITALIK_WALLET} on chainId:-1`,
    );
  });

  it("if fetching fiat value then it should throw if failed to resolve (native token)", async () => {
    await expect(
      loadAccountBalance({
        client: TEST_CLIENT,
        address: VITALIK_WALLET,
        chain: sepolia,
        showBalanceInFiat: "USD",
      }),
    ).rejects.toThrowError(
      `Failed to resolve fiat value for native token on chainId: ${sepolia.id}`,
    );
  });

  it("if fetching fiat value then it should throw if failed to resolve (erc20 token)", async () => {
    await expect(
      loadAccountBalance({
        client: TEST_CLIENT,
        address: VITALIK_WALLET,
        chain: sepolia,
        showBalanceInFiat: "USD",
        // this is a random erc20 token on sepolia that vitalik's wallet owns
        tokenAddress: "0xFfEBd97b29AD3b2BecF8E554e4a638A56C6Bbd59",
      }),
    ).rejects.toThrowError(
      `Failed to resolve fiat value for token: 0xFfEBd97b29AD3b2BecF8E554e4a638A56C6Bbd59 on chainId: ${sepolia.id}`,
    );
  });
});
