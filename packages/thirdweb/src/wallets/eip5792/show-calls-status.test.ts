import { describe, expect, test, vi } from "vitest";
import type { InjectedSupportedWalletIds } from "../__generated__/wallet-ids.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import type { Wallet } from "../interfaces/wallet.js";
import { showCallsStatus } from "./show-calls-status.js";

const RAW_UNSUPPORTED_ERROR = {
  code: -32601,
  message: "some nonsense the wallet sends us about not supporting",
};

const mocks = vi.hoisted(() => ({
  injectedRequest: vi.fn(),
}));

vi.mock("../injected/index.js", () => {
  return {
    getInjectedProvider: vi.fn().mockReturnValue({
      request: mocks.injectedRequest,
    }),
  };
});

describe.sequential("injected wallet", async () => {
  const wallet: Wallet<typeof METAMASK> = createWallet(METAMASK);

  test("should run", async () => {
    await showCallsStatus({ wallet, bundleId: "test" });

    expect(mocks.injectedRequest).toHaveBeenCalledWith({
      method: "wallet_showCallsStatus",
      params: ["test"],
    });
  });

  test("without support returns clean failed response", async () => {
    mocks.injectedRequest.mockRejectedValue(RAW_UNSUPPORTED_ERROR);
    const promise = showCallsStatus({
      wallet: wallet as Wallet<InjectedSupportedWalletIds>,
      bundleId: "test",
    });

    expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: io.metamask does not support wallet_showCallsStatus, reach out to them directly to request EIP-5792 support.]",
    );
  });
});

describe.sequential("other wallets", async () => {
  const wallet: Wallet = createWallet("inApp");

  test("do not support", async () => {
    const promise = showCallsStatus({
      wallet: wallet as Wallet<InjectedSupportedWalletIds>,
      bundleId: "test",
    });

    expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: showCallsStatus is currently unsupported for this wallet type]",
    );
  });
});
