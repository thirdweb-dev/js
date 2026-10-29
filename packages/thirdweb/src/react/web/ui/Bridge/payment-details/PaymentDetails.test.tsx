// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { CustomThemeProvider } from "../../../../core/design-system/CustomThemeProvider.js";
import type { BridgePrepareResult } from "../../../../core/hooks/useBridgePrepare.js";
import type { PaymentMethod } from "../types.js";
import { PaymentDetails } from "./PaymentDetails.js";

const { balanceQuery } = vi.hoisted(() => ({
  balanceQuery: { data: undefined as { value: bigint } | undefined },
}));

vi.mock("../common/token-balance.js", () => ({
  useTokenBalance: () => balanceQuery,
}));

vi.mock("../../../../core/hooks/others/useChainQuery.js", () => ({
  useChainsQuery: () => [],
}));

vi.mock("./PaymentOverview.js", () => ({
  PaymentOverview: () => null,
}));

const USDC_BASE = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chainId: 8453,
  decimals: 6,
  iconUri: "",
  name: "USD Coin",
  prices: { USD: 1 },
  symbol: "USDC",
} as const;

const USDC_ARBITRUM = {
  ...USDC_BASE,
  address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  chainId: 42161,
} as const;

const PAYER = "0x0000000000000000000000000000000000000001";

const quote = {
  destinationAmount: 5_000_000_000n,
  estimatedExecutionTimeMs: 60_000,
  intent: {
    amount: 5_000_000_000n,
    destinationChainId: USDC_ARBITRUM.chainId,
    destinationTokenAddress: USDC_ARBITRUM.address,
    originChainId: USDC_BASE.chainId,
    originTokenAddress: USDC_BASE.address,
    receiver: PAYER,
    sender: PAYER,
  },
  originAmount: 5_015_524_386n,
  steps: [
    {
      destinationAmount: 5_000_000_000n,
      destinationToken: USDC_ARBITRUM,
      estimatedExecutionTimeMs: 60_000,
      originAmount: 5_015_524_386n,
      originToken: USDC_BASE,
      transactions: [],
    },
  ],
  type: "buy",
} as unknown as BridgePrepareResult;

const paymentMethod = (balance: bigint): PaymentMethod => ({
  action: "buy",
  balance,
  hasEnoughBalance: true,
  originToken: USDC_BASE,
  payerWallet: {
    getAccount: () => ({ address: PAYER }),
  } as unknown as Wallet,
  type: "wallet",
});

const renderDetails = (method: PaymentMethod, onConfirm = vi.fn()) => {
  render(
    <CustomThemeProvider theme="dark">
      <PaymentDetails
        client={TEST_CLIENT}
        confirmButtonLabel={undefined}
        currency="USD"
        metadata={{ description: undefined, title: undefined }}
        modeInfo={{ mode: "fund_wallet" }}
        onBack={vi.fn()}
        onConfirm={onConfirm}
        onError={vi.fn()}
        paymentMethod={method}
        preparedQuote={quote}
      />
    </CustomThemeProvider>,
  );
  return onConfirm;
};

beforeEach(() => {
  balanceQuery.data = undefined;
});

describe("PaymentDetails", () => {
  it("disables confirm when the wallet balance is below the origin amount", () => {
    balanceQuery.data = { value: 5_003_934_909n };
    const onConfirm = renderDetails(paymentMethod(5_003_934_909n));

    const button = screen.getByRole<HTMLButtonElement>("button", {
      name: "Insufficient Balance",
    });
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirms when the wallet balance covers the origin amount", () => {
    balanceQuery.data = { value: 5_015_524_386n };
    const onConfirm = renderDetails(paymentMethod(5_003_934_909n));

    fireEvent.click(screen.getByRole("button", { name: "Confirm Payment" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("uses the payment method balance until the wallet balance loads", () => {
    renderDetails(paymentMethod(5_003_934_909n));

    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: "Insufficient Balance",
      }).disabled,
    ).toBe(true);
  });
});
