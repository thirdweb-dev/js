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
    client: mockClient,
    locale: {
      manageWallet: {
        linkedProfiles: "Linked Profiles",
        linkProfile: "Link Profile",
      },
      // biome-ignore lint/suspicious/noExplicitAny: Mocking data
    } as any,
    onBack: vi.fn(),
    setScreen: vi.fn(),
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
        data: [{ details: { email: "test@example.com" }, type: "email" }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("should display email for google profile type", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ details: { email: "google@example.com" }, type: "google" }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("google@example.com")).toBeInTheDocument();
    });

    it("should display phone number for phone profile type", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ details: { phone: "+1234567890" }, type: "phone" }],
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
            details: { address: "0x1234567890abcdef1234567890abcdef12345678" },
            type: "wallet",
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
        data: [{ details: { email: "cognito@example.com" }, type: "cognito" }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("cognito@example.com")).toBeInTheDocument();
    });

    it("should capitalize unknown profile types", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ details: {}, type: "unknown" }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });

    it("should not display guest profiles", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ details: {}, type: "guest" }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.queryByText("Guest")).not.toBeInTheDocument();
    });

    it("should render unlink button when there are multiple profiles", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [
          { details: { email: "test@example.com" }, type: "email" },
          { details: { email: "google@example.com" }, type: "google" },
        ],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.getAllByLabelText("Unlink")).toHaveLength(2);
    });

    it("should not render unlink button when there is only one profile", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ details: { email: "test@example.com" }, type: "email" }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.queryByLabelText("Unlink")).not.toBeInTheDocument();
    });

    it("should not display custom_jwt profiles", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [{ details: {}, type: "custom_jwt" }],
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Mocking data
      } as any);

      render(<LinkedProfilesScreen {...mockProps} />);
      expect(screen.queryByText("Custom_jwt")).not.toBeInTheDocument();
    });

    it("should display profiles that are not guest or custom_jwt", () => {
      vi.mocked(useProfiles).mockReturnValue({
        data: [
          { details: { email: "test@example.com" }, type: "email" },
          { details: {}, type: "custom_jwt" },
          { details: {}, type: "guest" },
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
