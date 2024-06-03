import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../../../contract/contract.js";
import { mintTo } from "../../../../extensions/erc20/write/mintTo.js";
import { deployERC20Contract } from "../../../../extensions/prebuilts/deploy-erc20.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { useWalletBalance } from "./useWalletBalance.js";

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe.runIf(process.env.TW_SECRET_KEY)("useWalletBalance", () => {
  it("should return the correct balance for erc20", async () => {
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

    const { result } = renderHook(
      () =>
        useWalletBalance({
          chain: ANVIL_CHAIN,
          address: TEST_ACCOUNT_A.address,
          client: TEST_CLIENT,
          tokenAddress: erc20Address,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    const defaultDecimal = 18;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.decimals).toBe(defaultDecimal);
    expect(result.current.data?.symbol).toBeDefined();
    expect(result.current.data?.name).toBeDefined();
    expect(result.current.data?.displayValue).toBe(amount.toString());
    expect(result.current.data?.value).toBe(
      BigInt(amount) * 10n ** BigInt(defaultDecimal),
    );
  });
});
