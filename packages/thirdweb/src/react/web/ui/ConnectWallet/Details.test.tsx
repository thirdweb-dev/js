import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { DetailsModal } from "./Details.js";
import { getConnectLocale } from "./locale/getConnectLocale.js";

vi.mock("../../../core/hooks/wallets/useActiveAccount.js", () => ({
  useActiveAccount: vi.fn(),
}));

const mockDetailsModalOptions = {};
const mockSupportedTokens = {};
const mockSupportedNFTs = {};
// biome-ignore lint/suspicious/noExplicitAny: Mock
const mockChains: any[] = [];
const mockDisplayBalanceToken = {};
const mockConnectOptions = {};
// biome-ignore lint/suspicious/noExplicitAny: Mock
const mockAssetTabs: any[] = [];
const mockOnDisconnect = vi.fn();

describe("Details Component", () => {
  beforeEach(() => {
    // Mock the animate method
    HTMLDivElement.prototype.animate = vi.fn().mockReturnValue({
      onfinish: vi.fn(),
    });
  });

  it("should close the modal when activeAccount is falsy", async () => {
    const closeModalMock = vi.fn();
    const locale = await getConnectLocale("en_US");

    vi.mocked(useActiveAccount).mockReturnValue(undefined);

    render(
      <DetailsModal
        client={TEST_CLIENT}
        locale={locale}
        detailsModal={mockDetailsModalOptions}
        theme="light"
        supportedTokens={mockSupportedTokens}
        supportedNFTs={mockSupportedNFTs}
        closeModal={closeModalMock}
        onDisconnect={mockOnDisconnect}
        chains={mockChains}
        displayBalanceToken={mockDisplayBalanceToken}
        connectOptions={mockConnectOptions}
        assetTabs={mockAssetTabs}
      />,
    );

    await waitFor(() => {
      expect(closeModalMock).toHaveBeenCalled();
    });
  });

  it("should render the DetailsModal with default props", async () => {
    const closeModalMock = vi.fn();
    const locale = await getConnectLocale("en_US");

    render(
      <DetailsModal
        client={TEST_CLIENT}
        locale={locale}
        theme="light"
        closeModal={closeModalMock}
        onDisconnect={mockOnDisconnect}
        chains={mockChains}
        connectOptions={mockConnectOptions}
      />,
    );

    // Add assertions to check if the modal is rendered correctly
    expect(screen.getByText("Connect Modal")).toBeInTheDocument();
  });

  it("should call closeModal when the close button is clicked", async () => {
    const closeModalMock = vi.fn();
    const locale = await getConnectLocale("en_US");

    render(
      <DetailsModal
        client={TEST_CLIENT}
        locale={locale}
        theme="light"
        closeModal={closeModalMock}
        onDisconnect={mockOnDisconnect}
        chains={mockChains}
        connectOptions={mockConnectOptions}
      />,
    );

    // Simulate clicking the close button
    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(closeModalMock).toHaveBeenCalled();
    });
  });
});
