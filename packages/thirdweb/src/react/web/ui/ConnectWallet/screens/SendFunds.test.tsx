import { describe, expect, it, vi } from "vitest";
import { render } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { base } from "../../../../../chains/chain-definitions/base.js";
import { useActiveWalletChain } from "../../../../../react/core/hooks/wallets/useActiveWalletChain.js";
import en from "../locale/en.js";
import { SendFundsForm } from "./SendFunds.js";

const client = TEST_CLIENT;

describe("SendFunds screen", () => {
  it("should render a title with locale.title", () => {
    vi.mock(
      "../../../../../react/core/hooks/wallets/useActiveWalletChain.js",
      () => ({
        useActiveWalletChain: vi.fn(),
      }),
    );
    vi.mocked(useActiveWalletChain).mockReturnValue(base);
    const { container } = render(
      <SendFundsForm
        amount={"1"}
        client={client}
        connectLocale={en}
        onBack={() => {}}
        onTokenSelect={() => {}}
        receiverAddress={TEST_ACCOUNT_A.address}
        setAmount={() => {}}
        setReceiverAddress={() => {}}
        token={{ nativeToken: true }}
      />,
    );
    const element = container.querySelector("h2");
    expect(element).not.toBe(null);
    expect(element?.innerHTML).toBe(en.sendFundsScreen.title);
    vi.resetAllMocks();
  });

  it("SendFundsForm should render the send button", () => {
    vi.mock(
      "../../../../../react/core/hooks/wallets/useActiveWalletChain.js",
      () => ({
        useActiveWalletChain: vi.fn(),
      }),
    );
    vi.mocked(useActiveWalletChain).mockReturnValue(base);
    const { container } = render(
      <SendFundsForm
        amount={"1"}
        client={client}
        connectLocale={en}
        onBack={() => {}}
        onTokenSelect={() => {}}
        receiverAddress={TEST_ACCOUNT_A.address}
        setAmount={() => {}}
        setReceiverAddress={() => {}}
        token={{ nativeToken: true }}
      />,
    );
    const element = container.querySelector(
      "button.tw-sendfunds-screen-send-button",
    );
    expect(element?.innerHTML).toBe(en.sendFundsScreen.submitButton);
    vi.resetAllMocks();
  });
});
