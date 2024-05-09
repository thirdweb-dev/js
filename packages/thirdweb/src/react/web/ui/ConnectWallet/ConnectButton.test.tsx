import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { render, screen } from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { ConnectButton } from "./ConnectButton.js";

describe("ConnectButton", () => {
  beforeAll(() => {
    vi.mock("./locale/getConnectLocale.js", () => ({
      useConnectLocale: vi.fn().mockReturnValue({
        data: {
          defaultButtonTitle: "Connect Wallet",
        },
        isLoading: false,
      }),
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe("defaults", () => {
    beforeEach(() => {
      render(<ConnectButton client={TEST_CLIENT} />);
    });

    it("should render", () => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should display 'Connect Wallet' on initial render", () => {
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
