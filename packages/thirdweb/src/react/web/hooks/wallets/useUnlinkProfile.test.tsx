import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { useConnectedWallets } from "../../../../react/core/hooks/wallets/useConnectedWallets.js";
import type { Profile } from "../../../../wallets/in-app/core/authentication/types.js";
import { unlinkProfile } from "../../../../wallets/in-app/web/lib/auth/index.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useUnlinkProfile } from "./useUnlinkProfile.js";

vi.mock("../../../../wallets/in-app/web/lib/auth/index.js");
vi.mock("../../../core/hooks/wallets/useConnectedWallets.js");

describe("useUnlinkProfile", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(queryClient, "invalidateQueries");
  });

  const mockProfile = {} as unknown as Profile;
  it("should call unlinkProfile with correct parameters", async () => {
    vi.mocked(useConnectedWallets).mockReturnValue([]);

    const { result } = renderHook(() => useUnlinkProfile(), {
      wrapper,
    });
    const mutationFn = result.current.mutateAsync;

    await act(async () => {
      await mutationFn({ client: TEST_CLIENT, profileToUnlink: mockProfile });
    });

    expect(unlinkProfile).toHaveBeenCalledWith({
      allowAccountDeletion: false,
      client: TEST_CLIENT,
      ecosystem: undefined,
      profileToUnlink: mockProfile,
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["profiles"],
    });
  });

  it("should include ecosystem if ecosystem wallet is found", async () => {
    const mockWallet = {
      getConfig: () => ({ partnerId: "partner-id" }),
      id: "ecosystem.wallet-id",
    } as unknown as Wallet;
    vi.mocked(useConnectedWallets).mockReturnValue([mockWallet]);

    const { result } = renderHook(() => useUnlinkProfile(), {
      wrapper,
    });
    const mutationFn = result.current.mutateAsync;

    await act(async () => {
      await mutationFn({ client: TEST_CLIENT, profileToUnlink: mockProfile });
    });

    expect(unlinkProfile).toHaveBeenCalledWith({
      allowAccountDeletion: false,
      client: TEST_CLIENT,
      ecosystem: {
        id: mockWallet.id,
        partnerId: (mockWallet as Wallet<`ecosystem.${string}`>).getConfig()
          ?.partnerId,
      },
      profileToUnlink: mockProfile,
    });
  });
});
