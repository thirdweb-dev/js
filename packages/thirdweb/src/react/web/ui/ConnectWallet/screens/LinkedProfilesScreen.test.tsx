import { beforeEach } from "node:test";
import {
  QueryClient,
  QueryClientProvider,
  type UseQueryResult,
} from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { useSocialProfiles } from "../../../../../react/core/social/useSocialProfiles.js";
import type { SocialProfile } from "../../../../../social/types.js";
import { shortenAddress } from "../../../../../utils/address.js";
import type { Profile } from "../../../../../wallets/in-app/core/authentication/types.js";
import { useProfiles } from "../../../hooks/wallets/useProfiles.js";
import type { ConnectLocale } from "../locale/types.js";
import { LinkedProfilesScreen } from "./LinkedProfilesScreen.js";

vi.mock("../../../hooks/wallets/useProfiles");
vi.mock("../../../../../react/core/social/useSocialProfiles");

describe("LinkedProfile component", () => {
  const locale = {
    manageWallet: {
      linkedProfiles: "Linked Profiles",
      linkProfile: "Link Profile",
    },
  } as ConnectLocale;
  const queryClient = new QueryClient();
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render email profile correctly", () => {
    vi.mocked(useProfiles).mockReturnValue({
      data: [{ type: "email", details: { email: "user@example.com" } }],
      isLoading: false,
    } as UseQueryResult<Profile[]>);
    vi.mocked(useSocialProfiles).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as UseQueryResult<SocialProfile[]>);

    render(
      <QueryClientProvider client={queryClient}>
        <LinkedProfilesScreen
          onBack={() => {}}
          setScreen={() => {}}
          locale={locale}
          client={TEST_CLIENT}
        />
      </QueryClientProvider>,
    );

    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });

  it("should render wallet address profile correctly", () => {
    vi.mocked(useProfiles).mockReturnValue({
      data: [{ type: "wallet", details: { address: TEST_ACCOUNT_A.address } }],
      isLoading: false,
    } as UseQueryResult<Profile[]>);
    vi.mocked(useSocialProfiles).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as UseQueryResult<SocialProfile[]>);

    render(
      <QueryClientProvider client={queryClient}>
        <LinkedProfilesScreen
          onBack={() => {}}
          setScreen={() => {}}
          locale={locale}
          client={TEST_CLIENT}
        />
      </QueryClientProvider>,
    );

    expect(
      screen.getByText(shortenAddress(TEST_ACCOUNT_A.address, 6)),
    ).toBeInTheDocument();
  });

  it("should render unlink button when enableUnlinking is true", () => {
    vi.mocked(useProfiles).mockReturnValue({
      data: [
        { type: "email", details: { email: "test@example.com" } },
        { type: "google", details: { email: "test@example.com" } },
      ],
      isLoading: false,
    } as UseQueryResult<Profile[]>);
    vi.mocked(useSocialProfiles).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as UseQueryResult<SocialProfile[]>);

    render(
      <QueryClientProvider client={queryClient}>
        <LinkedProfilesScreen
          onBack={() => {}}
          setScreen={() => {}}
          locale={locale}
          client={TEST_CLIENT}
        />
      </QueryClientProvider>,
    );

    expect(screen.getAllByRole("button", { name: "Unlink" })).toHaveLength(2);
  });

  it("should not render unlink button when enableUnlinking is false", () => {
    vi.mocked(useProfiles).mockReturnValue({
      data: [{ type: "email", details: { email: "test@example.com" } }],
      isLoading: false,
    } as UseQueryResult<Profile[]>);
    vi.mocked(useSocialProfiles).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as UseQueryResult<SocialProfile[]>);

    render(
      <QueryClientProvider client={queryClient}>
        <LinkedProfilesScreen
          onBack={() => {}}
          setScreen={() => {}}
          locale={locale}
          client={TEST_CLIENT}
        />
      </QueryClientProvider>,
    );

    expect(
      screen.queryByRole("button", { name: "Unlink" }),
    ).not.toBeInTheDocument();
  });
});
