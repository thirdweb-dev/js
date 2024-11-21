import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { render, screen, waitFor } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getWalletBalance } from "../../../../../wallets/utils/getWalletBalance.js";
import { AccountBalance } from "./balance.js";
import { AccountProvider } from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("AccountBalance component", () => {
  it("format the balance properly", async () => {
    const roundTo1Decimal = (num: number): number => Math.round(num * 10) / 10;
    const balance = await getWalletBalance({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      address: TEST_ACCOUNT_A.address,
    });

    render(
      <AccountProvider address={TEST_ACCOUNT_A.address} client={TEST_CLIENT}>
        <AccountBalance chain={ANVIL_CHAIN} formatFn={roundTo1Decimal} />
      </AccountProvider>,
    );

    waitFor(() =>
      expect(
        screen.getByText(roundTo1Decimal(Number(balance.displayValue)), {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });

  it("should fallback properly if failed to load", () => {
    render(
      <AccountProvider address={TEST_ACCOUNT_A.address} client={TEST_CLIENT}>
        <AccountBalance
          chain={undefined}
          fallbackComponent={<span>oops</span>}
        />
      </AccountProvider>,
    );

    waitFor(() =>
      expect(
        screen.getByText("oops", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });
});
