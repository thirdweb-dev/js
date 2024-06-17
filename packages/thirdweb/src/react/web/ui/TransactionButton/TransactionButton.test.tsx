import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { render, screen } from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../../test/src/test-wallets.js";
import { prepareTransaction, toWei } from "../../../../exports/thirdweb.js";
import { TransactionButton } from "./index.js";

vi.mock("../../../../transaction/actions/send-transaction.js", () => ({
  sendTransaction: vi.fn(),
}));

const TRANSFER_TX = prepareTransaction({
  client: TEST_CLIENT,
  chain: ANVIL_CHAIN,
  to: TEST_ACCOUNT_A.address,
  value: BigInt(toWei("100")),
});

const mocks = vi.hoisted(() => {
  return {
    activeAccount: vi.fn(),
    activeWallet: vi.fn(),
    switchActiveWalletChain: vi.fn(),
    transaction: vi.fn(),
  };
});

describe.sequential("TransactionButton", () => {
  beforeAll(() => {
    vi.mock("../../../web/hooks/wallets/useActiveAccount.js", () => ({
      useActiveAccount: mocks.activeAccount,
    }));
    vi.mock("../../../web/hooks/wallets/useActiveWallet.js", () => ({
      useActiveWallet: mocks.activeWallet,
    }));
    vi.mock("../../../web/hooks/wallets/useSwitchActiveWalletChain.js", () => ({
      useSwitchActiveWalletChain: mocks.switchActiveWalletChain,
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    mocks.transaction.mockReturnValue(TRANSFER_TX);
    render(
      <TransactionButton transaction={mocks.transaction}>
        Send ETH
      </TransactionButton>,
    );
  });

  describe("defaults", () => {
    it("should render", () => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should display text on initial render", () => {
      expect(screen.getByText("Send ETH")).toBeInTheDocument();
    });
  });

  describe("with account", () => {
    beforeAll(() => {
      mocks.activeAccount.mockReturnValue(TEST_ACCOUNT_A);
    });

    it("should be enabled", () => {
      const button = screen.getByRole("button", { name: "Send ETH" });
      expect(button).not.toBeDisabled();
    });
  });

  describe("without account", () => {
    beforeAll(() => {
      mocks.activeAccount.mockReturnValue(undefined);
    });

    it("should be disabled", () => {
      const button = screen.getByRole("button", { name: "Send ETH" });
      expect(button).toBeDisabled();
    });
  });
});
