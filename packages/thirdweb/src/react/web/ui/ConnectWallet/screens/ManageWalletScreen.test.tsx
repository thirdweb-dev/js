import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../../test/src/test-clients.js";
import { createWallet } from "../../../../../wallets/create-wallet.js";
import { useAdminWallet } from "../../../../core/hooks/wallets/useAdminWallet.js";
import en from "../locale/en.js";
import { ManageWalletScreen } from "./ManageWalletScreen.js";

vi.mock("../../../../core/hooks/wallets/useAdminWallet");

describe("ManageWalletScreen", () => {
  const mockProps = {
    client: TEST_CLIENT,
    closeModal: vi.fn(),
    locale: en,
    onBack: vi.fn(),
    setScreen: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useAdminWallet).mockReturnValue(createWallet("inApp"));
  });

  it("should render the modal header with the correct title", () => {
    render(<ManageWalletScreen {...mockProps} />);
    expect(screen.getByText(en.manageWallet.title)).toBeInTheDocument();
  });

  it.skip("should render the linked profiles button if allowLinkingProfiles is true", () => {
    render(
      <ManageWalletScreen
        {...mockProps}
        manageWallet={{ allowLinkingProfiles: true }}
      />,
    );
    expect(
      screen.getByText(en.manageWallet.linkedProfiles),
    ).toBeInTheDocument();
  });

  it.skip("should not render the linked profiles button if allowLinkingProfiles is false", () => {
    render(
      <ManageWalletScreen
        {...mockProps}
        manageWallet={{ allowLinkingProfiles: false }}
      />,
    );
    expect(
      screen.queryByText(en.manageWallet.linkedProfiles),
    ).not.toBeInTheDocument();
  });

  it.skip("should default to showing linked profiles button", () => {
    render(<ManageWalletScreen {...mockProps} />);
    expect(
      screen.getByText(en.manageWallet.linkedProfiles),
    ).toBeInTheDocument();
  });

  it("should render the wallet connect receiver button", () => {
    render(<ManageWalletScreen {...mockProps} />);
    expect(screen.getByText(en.manageWallet.connectAnApp)).toBeInTheDocument();
  });
});
