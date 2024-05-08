import { beforeEach, describe, expect, it, suite, test, vi } from "vitest";
import { render, screen } from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { ConnectButton } from "./ConnectButton.js";
import * as connectLocale from "./locale/getConnectLocale.js";

vi.mock("./locale/getConnectLocale.js", () => ({
  useConnectLocale: vi.fn().mockReturnValue({
    data: {
      defaultButtonTitle: "Connect Wallet",
    },
    isLoading: false,
  }),
}));

suite("ConnectButton", () => {
  describe("defaults", () => {
    beforeEach(() => {
      render(<ConnectButton client={TEST_CLIENT} />);
    });

    it("renders", () => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("displays 'Connect Wallet' on initial render", () => {
      expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
    });
  });

  it("should override default text", () => {
    render(
      <ConnectButton
        client={TEST_CLIENT}
        connectButton={{ label: "Sign In" }}
      />,
    );
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });
});
