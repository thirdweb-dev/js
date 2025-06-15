import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Action } from "../../../bridge/types/BridgeAction.js";
import type { RouteStep } from "../../../bridge/types/Route.js";
import { defineChain } from "../../../chains/utils.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { WindowAdapter } from "../adapters/WindowAdapter.js";
import type { BridgePrepareResult } from "./useBridgePrepare.js";
import { flattenRouteSteps } from "./useStepExecutor.js";

// Mock React hooks
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useState: vi.fn((initial) => {
      let state = initial;
      return [
        state,
        (newState: typeof initial) => {
          state = typeof newState === "function" ? newState(state) : newState;
        },
      ];
    }),
    useCallback: vi.fn((fn) => fn),
    useMemo: vi.fn((fn) => fn()),
    useRef: vi.fn((initial) => ({ current: initial })),
    useEffect: vi.fn((fn) => fn()),
  };
});

// Mock modules
vi.mock("../../../transaction/prepare-transaction.js", () => ({
  prepareTransaction: vi.fn((options) => ({
    ...options,
    type: "prepared",
  })),
}));

vi.mock("../../../transaction/actions/send-transaction.js", () => ({
  sendTransaction: vi.fn(),
}));

vi.mock("../../../transaction/actions/send-batch-transaction.js", () => ({
  sendBatchTransaction: vi.fn(),
}));

vi.mock("../../../transaction/actions/wait-for-tx-receipt.js", () => ({
  waitForReceipt: vi.fn(),
}));

vi.mock("../../../bridge/Status.js", () => ({
  status: vi.fn(),
}));

vi.mock("../../../bridge/index.js", () => ({
  Onramp: {
    status: vi.fn(),
  },
}));

vi.mock("../errors/mapBridgeError.js", () => ({
  isRetryable: vi.fn(
    (code: string) =>
      code === "INTERNAL_SERVER_ERROR" || code === "UNKNOWN_ERROR",
  ),
}));

vi.mock("./useBridgePrepare.js", () => ({
  useBridgePrepare: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

// Test helpers
const mockClient: ThirdwebClient = {
  clientId: "test-client",
  secretKey: undefined,
} as ThirdwebClient;

const _mockWindowAdapter: WindowAdapter = {
  open: vi.fn(),
};

const _createMockWallet = (
  hasAccount = true,
  supportsBatch = false,
): Wallet => {
  const mockAccount = hasAccount
    ? {
        address: "0x1234567890123456789012345678901234567890",
        sendTransaction: vi.fn(),
        sendBatchTransaction: supportsBatch ? vi.fn() : undefined,
        signMessage: vi.fn(),
        signTypedData: vi.fn(),
      }
    : undefined;

  return {
    id: "test-wallet",
    getAccount: () => mockAccount,
    getChain: vi.fn(),
    autoConnect: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    switchChain: vi.fn(),
    subscribe: vi.fn(),
    getConfig: () => ({}),
  } as unknown as Wallet;
};

const createMockRouteSteps = (
  stepCount = 2,
  txPerStep = 2,
  includeApproval = true,
): RouteStep[] => {
  const steps: RouteStep[] = [];

  for (let i = 0; i < stepCount; i++) {
    const transactions = [];
    for (let j = 0; j < txPerStep; j++) {
      transactions.push({
        id: `0x${i}${j}` as `0x${string}`,
        action: (includeApproval && i === 0 && j === 0
          ? "approval"
          : "transfer") as Action,
        to: "0xabcdef1234567890123456789012345678901234" as `0x${string}`,
        data: `0x${i}${j}data` as `0x${string}`,
        value: j === 0 ? 1000000000000000000n : undefined,
        chainId: i === 0 ? 1 : 137, // Different chains for different steps
        chain: i === 0 ? defineChain(1) : defineChain(137),
        client: mockClient,
      });
    }

    steps.push({
      originToken: {
        chainId: 1,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        priceUsd: 1,
      },
      destinationToken: {
        chainId: 137,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" as `0x${string}`,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        priceUsd: 1,
      },
      originAmount: 1000000n,
      destinationAmount: 999000n,
      estimatedExecutionTimeMs: 60000,
      transactions,
    });
  }

  // Modify steps to have all transactions on the same chain
  if (steps[0]?.transactions) {
    for (const tx of steps[0].transactions) {
      tx.chainId = 1;
      tx.chain = defineChain(1);
    }
  }
  if (steps[1]?.transactions) {
    for (const tx of steps[1].transactions) {
      tx.chainId = 1;
      tx.chain = defineChain(1);
    }
  }

  return steps;
};

const _createMockBuyQuote = (steps: RouteStep[]): BridgePrepareResult => ({
  type: "buy",
  originAmount: 1000000000000000000n,
  destinationAmount: 999000000000000000n,
  timestamp: Date.now(),
  estimatedExecutionTimeMs: 120000,
  steps,
  intent: {
    originChainId: 1,
    originTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    destinationChainId: 137,
    destinationTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount: 999000000000000000n,
    sender: "0x1234567890123456789012345678901234567890",
    receiver: "0x1234567890123456789012345678901234567890",
  },
});

describe("useStepExecutor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("flattenRouteSteps", () => {
    it("should flatten route steps into linear transaction array", () => {
      const steps = createMockRouteSteps(2, 2);
      const flattened = flattenRouteSteps(steps);

      expect(flattened).toHaveLength(4);
      expect(flattened[0]?._index).toBe(0);
      expect(flattened[0]?._stepIndex).toBe(0);
      expect(flattened[2]?._index).toBe(2);
      expect(flattened[2]?._stepIndex).toBe(1);
    });

    it("should handle empty steps array", () => {
      const flattened = flattenRouteSteps([]);
      expect(flattened).toHaveLength(0);
    });

    it("should handle steps with no transactions", () => {
      const steps: RouteStep[] = [
        {
          originToken: {
            chainId: 1,
            address:
              "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
            symbol: "USDC",
            name: "USD Coin",
            decimals: 6,
            priceUsd: 1,
          },
          destinationToken: {
            chainId: 137,
            address:
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" as `0x${string}`,
            symbol: "USDC",
            name: "USD Coin",
            decimals: 6,
            priceUsd: 1,
          },
          originAmount: 1000000n,
          destinationAmount: 999000n,
          estimatedExecutionTimeMs: 60000,
          transactions: [],
        },
      ];

      const flattened = flattenRouteSteps(steps);
      expect(flattened).toHaveLength(0);
    });
  });
});
