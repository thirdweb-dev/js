import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../../../../test/src/react-render.js";
import { useSocialProfiles } from "../../../../core/social/useSocialProfiles.js";
import { useProfiles } from "../../../hooks/wallets/useProfiles.js";
import { LinkedProfilesScreen } from "./LinkedProfilesScreen.jsx";

// Mock the hooks
vi.mock("../../../hooks/wallets/useProfiles");
vi.mock("../../../../core/social/useSocialProfiles");
vi.mock("../../components/Img", () => ({
  Img: () => <div data-testid="mock-img">Mock Image</div>,
}));

describe("LinkedProfilesScreen", () => {
  const mockClient = {
    clientId: "test-client-id",
    secretKey: undefined,
  };

  const mockProps = {
    onBack: vi.fn(),
    setScreen: vi.fn(),
    locale: {
      manageWallet: {
        linkedProfiles: "Linked Profiles",
        linkProfile: "Link Profile",
      },
      // biome-ignore lint/suspicious/noExplicitAny: Mocking data
    } as any,
    client: mockClient,
  };

  beforeEach(() => {
    vi.mocked(useSocialProfiles).mockReturnValue({
      data: undefined,
      isLoading: false,
      // biome-ignore lint/suspicious/noExplicitAny: Mocking data
    } as any);
  });

  describe("getProfileDisplayName", () => {
    it("should display email for email profile type", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ type: "email", details: { email: "test@example.com" } }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("should display email for google profile type", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ type: "google", details: { email: "google@example.com" } }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("google@example.com")).toBeInTheDocument();
    });

    it("should display phone number for phone profile type", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ type: "phone", details: { phone: "+1234567890" } }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("+1234567890")).toBeInTheDocument();
    });

    it("should display shortened address when address is present", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [
          {
            type: "wallet",
            details: { address: "0x1234567890abcdef1234567890abcdef12345678" },
          },
        ],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("0x123456...345678")).toBeInTheDocument();
    });

    it("should display email for cognito profile type", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ type: "cognito", details: { email: "cognito@example.com" } }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("cognito@example.com")).toBeInTheDocument();
    });

    it("should capitalize unknown profile types", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ type: "unknown", details: {} }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });

    it("should not display guest profiles", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ type: "guest", details: {} }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.queryByText("Guest")).not.toBeInTheDocument();
    });

    it("should render unlink button when there are multiple profiles", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [
          { type: "email", details: { email: "test@example.com" } },
          { type: "google", details: { email: "google@example.com" } },
        ],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getAllByLabelText("Unlink")).toHaveLength(2);
    });

    it("should not render unlink button when there is only one profile", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ type: "email", details: { email: "test@example.com" } }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.queryByLabelText("Unlink")).not.toBeInTheDocument();
    });

    it("should not display custom_jwt profiles", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ type: "custom_jwt", details: {} }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.queryByText("Custom_jwt")).not.toBeInTheDocument();
    });

    it("should display profiles that are not guest or custom_jwt", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [
          { type: "email", details: { email: "test@example.com" } },
          { type: "custom_jwt", details: {} },
          { type: "guest", details: {} },
        ],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.queryByText("Custom_jwt")).not.toBeInTheDocument();
      expect(screen.queryByText("Guest")).not.toBeInTheDocument();
    });
  });
});
