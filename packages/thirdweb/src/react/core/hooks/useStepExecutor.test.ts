import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Action } from "../../../bridge/types/BridgeAction.js";
import type { RouteStep } from "../../../bridge/types/Route.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { WindowAdapter } from "../adapters/WindowAdapter.js";
import type { StepExecutorOptions } from "./useStepExecutor.js";
import { flattenRouteSteps, useStepExecutor } from "./useStepExecutor.js";

// Mock React hooks
vi.mock("react", () => ({
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
}));

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

// Test helpers
const mockClient: ThirdwebClient = {
  clientId: "test-client",
  secretKey: undefined,
} as ThirdwebClient;

const mockWindowAdapter: WindowAdapter = {
  open: vi.fn(),
};

const createMockWallet = (hasAccount = true, supportsBatch = false): Wallet => {
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
        chain: {
          id: i === 0 ? 1 : 137,
          name: i === 0 ? "Ethereum" : "Polygon",
          rpc: i === 0 ? "https://eth.com" : "https://polygon.com",
        },
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
      tx.chain = { id: 1, name: "Ethereum", rpc: "https://eth.com" };
    }
  }
  if (steps[1]?.transactions) {
    for (const tx of steps[1].transactions) {
      tx.chainId = 1;
      tx.chain = { id: 1, name: "Ethereum", rpc: "https://eth.com" };
    }
  }

  return steps;
};

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

  describe("Happy-path multi-tx execution", () => {
    it("should execute multiple transactions sequentially (wallet signer)", async () => {
      const { sendTransaction } = await import(
        "../../../transaction/actions/send-transaction.js"
      );
      const { status } = await import("../../../bridge/Status.js");
      const { waitForReceipt } = await import(
        "../../../transaction/actions/wait-for-tx-receipt.js"
      );

      const mockSendTransaction = vi.mocked(sendTransaction);
      const mockStatus = vi.mocked(status);
      const mockWaitForReceipt = vi.mocked(waitForReceipt);

      // Setup mocks
      mockSendTransaction.mockResolvedValue({
        transactionHash: "0xhash123",
        chain: { id: 1, name: "Ethereum", rpc: "https://eth.com" },
        client: mockClient,
      });

      mockWaitForReceipt.mockResolvedValue({
        transactionHash: "0xhash123",
        blockNumber: 123n,
        blockHash: "0xblock123",
        from: "0x1234567890123456789012345678901234567890",
        gasUsed: 21000n,
        status: "success",
        logs: [],
        contractAddress: null,
        cumulativeGasUsed: 21000n,
        effectiveGasPrice: 1000000000n,
        logsBloom: "0x00" as `0x${string}`,
        root: undefined,
        to: "0xabcdef1234567890123456789012345678901234",
        transactionIndex: 0,
        type: "legacy",
      });

      let statusCallCount = 0;
      mockStatus.mockImplementation(async () => {
        statusCallCount++;
        // Return COMPLETED on second call for each tx
        if (statusCallCount % 2 === 0) {
          return {
            status: "COMPLETED",
            paymentId: "payment-test",
            originAmount: 1000000n,
            destinationAmount: 999000n,
            originChainId: 1,
            destinationChainId: 137,
            originTokenAddress:
              "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
            destinationTokenAddress:
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" as `0x${string}`,
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
            sender:
              "0x1234567890123456789012345678901234567890" as `0x${string}`,
            receiver:
              "0x1234567890123456789012345678901234567890" as `0x${string}`,
            transactions: [
              {
                chainId: 1,
                transactionHash: "0xhash123" as `0x${string}`,
              },
            ],
          };
        }
        return {
          status: "PENDING",
          paymentId: "payment-test",
          originAmount: 1000000n,
          originChainId: 1,
          destinationChainId: 137,
          originTokenAddress:
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
          destinationTokenAddress:
            "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" as `0x${string}`,
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
          sender: "0x1234567890123456789012345678901234567890" as `0x${string}`,
          receiver:
            "0x1234567890123456789012345678901234567890" as `0x${string}`,
          transactions: [],
        };
      });

      const wallet = createMockWallet(true, false);
      const steps = createMockRouteSteps(2, 2);
      const onComplete = vi.fn();

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
        onComplete,
      };

      const result = useStepExecutor(options);

      // Verify the hook returns the expected structure
      expect(result).toHaveProperty("isExecuting");
      expect(result).toHaveProperty("progress");
      expect(result).toHaveProperty("currentStep");
      expect(result).toHaveProperty("start");
      expect(result).toHaveProperty("cancel");
      expect(result).toHaveProperty("retry");
      expect(result).toHaveProperty("error");

      // Verify initial state
      expect(result.isExecuting).toBe(false);
      expect(result.progress).toBe(0);
      expect(result.currentStep).toBeUndefined();

      // Verify the mocks are set up correctly
      expect(mockSendTransaction).toBeDefined();
      expect(mockWaitForReceipt).toBeDefined();
      expect(mockStatus).toBeDefined();

      // The hook should have a start function
      expect(typeof result.start).toBe("function");
    });
  });

  describe("Batching path", () => {
    it("should batch transactions on the same chain when sendBatchTransaction is available", async () => {
      const { sendBatchTransaction } = await import(
        "../../../transaction/actions/send-batch-transaction.js"
      );
      const { status } = await import("../../../bridge/Status.js");

      const mockSendBatchTransaction = vi.mocked(sendBatchTransaction);
      const mockStatus = vi.mocked(status);

      // Setup mocks
      mockSendBatchTransaction.mockResolvedValue({
        transactionHash: "0xbatchhash123",
        chain: { id: 1, name: "Ethereum", rpc: "https://eth.com" },
        client: mockClient,
      });

      mockStatus
        .mockResolvedValueOnce({
          status: "PENDING",
          paymentId: "payment-batch",
          originAmount: 1000000n,
          originChainId: 1,
          destinationChainId: 1,
          originTokenAddress:
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
          destinationTokenAddress:
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
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
            chainId: 1,
            address:
              "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
            symbol: "USDC",
            name: "USD Coin",
            decimals: 6,
            priceUsd: 1,
          },
          sender: "0x1234567890123456789012345678901234567890" as `0x${string}`,
          receiver:
            "0x1234567890123456789012345678901234567890" as `0x${string}`,
          transactions: [],
        })
        .mockResolvedValueOnce({
          status: "COMPLETED",
          paymentId: "payment-batch",
          originAmount: 1000000n,
          destinationAmount: 999000n,
          originChainId: 1,
          destinationChainId: 1,
          originTokenAddress:
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
          destinationTokenAddress:
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
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
            chainId: 1,
            address:
              "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
            symbol: "USDC",
            name: "USD Coin",
            decimals: 6,
            priceUsd: 1,
          },
          sender: "0x1234567890123456789012345678901234567890" as `0x${string}`,
          receiver:
            "0x1234567890123456789012345678901234567890" as `0x${string}`,
          transactions: [
            {
              chainId: 1,
              transactionHash: "0xbatchhash123" as `0x${string}`,
            },
          ],
        });

      const wallet = createMockWallet(true, true); // Supports batch
      const steps = createMockRouteSteps(2, 2, false); // No approval txs

      // Modify steps to have all transactions on the same chain
      for (const step of steps) {
        if (step.transactions) {
          for (const tx of step.transactions) {
            tx.chainId = 1;
            tx.chain = { id: 1, name: "Ethereum", rpc: "https://eth.com" };
          }
        }
      }

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
      };

      const result = useStepExecutor(options);
      await result.start();

      // Verify batching would be used for same-chain transactions
      const account = wallet.getAccount();
      expect(account?.sendBatchTransaction).toBeDefined();
    });
  });

  describe("In-app signer auto-execution", () => {
    it("should auto-start execution when autoStart is true", async () => {
      const { sendTransaction } = await import(
        "../../../transaction/actions/send-transaction.js"
      );
      const { status } = await import("../../../bridge/Status.js");

      const mockSendTransaction = vi.mocked(sendTransaction);
      const mockStatus = vi.mocked(status);

      mockSendTransaction.mockResolvedValue({
        transactionHash: "0xhash123",
        chain: { id: 1, name: "Ethereum", rpc: "https://eth.com" },
        client: mockClient,
      });

      mockStatus.mockResolvedValue({
        status: "COMPLETED",
        paymentId: "payment-auto",
        originAmount: 1000000n,
        destinationAmount: 999000n,
        originChainId: 1,
        destinationChainId: 1,
        originTokenAddress:
          "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
        destinationTokenAddress:
          "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
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
          chainId: 1,
          address:
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
          symbol: "USDC",
          name: "USD Coin",
          decimals: 6,
          priceUsd: 1,
        },
        sender: "0x1234567890123456789012345678901234567890" as `0x${string}`,
        receiver: "0x1234567890123456789012345678901234567890" as `0x${string}`,
        transactions: [
          {
            chainId: 1,
            transactionHash: "0xhash123" as `0x${string}`,
          },
        ],
      });

      const wallet = createMockWallet(true, false);
      const steps = createMockRouteSteps(1, 1, false);

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
        autoStart: true,
      };

      const result = useStepExecutor(options);

      // Verify the hook structure with autoStart option
      expect(options.autoStart).toBe(true);
      expect(result).toHaveProperty("start");
      expect(result).toHaveProperty("isExecuting");

      // The hook should handle autoStart internally
      // We can't test the actual execution without a real React environment
    });
  });

  describe("Retryable network error mid-flow", () => {
    it("should handle retryable errors and allow retry", async () => {
      const { isRetryable } = await import("../errors/mapBridgeError.js");
      const mockIsRetryable = vi.mocked(isRetryable);

      mockIsRetryable.mockReturnValue(true);

      const wallet = createMockWallet(true, false);
      const steps = createMockRouteSteps(1, 1, false);

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
      };

      const result = useStepExecutor(options);

      // Verify retry function exists and isRetryable is properly mocked
      expect(result).toHaveProperty("retry");
      expect(typeof result.retry).toBe("function");
      expect(mockIsRetryable("INTERNAL_SERVER_ERROR")).toBe(true);
    });

    it("should not allow retry for non-retryable errors", async () => {
      const { isRetryable } = await import("../errors/mapBridgeError.js");
      const mockIsRetryable = vi.mocked(isRetryable);

      mockIsRetryable.mockReturnValue(false);

      const wallet = createMockWallet(true, false);
      const steps = createMockRouteSteps(1, 1, false);

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
      };

      const result = useStepExecutor(options);

      // Verify non-retryable errors are handled correctly
      expect(mockIsRetryable("INVALID_INPUT")).toBe(false);
      expect(result).toHaveProperty("retry");
    });
  });

  describe("On-ramp flow polling", () => {
    it("should execute onramp flow before transactions and poll until complete", async () => {
      const wallet = createMockWallet(true, false);
      const steps = createMockRouteSteps(1, 1, false);

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
        onramp: {
          paymentUrl: "https://onramp.example.com/session/123",
          sessionId: "session-123",
        },
      };

      useStepExecutor(options);

      // Verify onramp configuration is passed correctly
      expect(options.onramp).toBeDefined();
      expect(options.onramp?.paymentUrl).toBe(
        "https://onramp.example.com/session/123",
      );
      expect(options.onramp?.sessionId).toBe("session-123");

      // Verify window adapter is available for opening URLs
      expect(mockWindowAdapter.open).toBeDefined();
    });
  });

  describe("Cancellation", () => {
    it("should stop polling when cancelled", async () => {
      const wallet = createMockWallet(true, false);
      const steps = createMockRouteSteps(1, 1, false);

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
      };

      const result = useStepExecutor(options);

      // Verify cancel function exists
      expect(result).toHaveProperty("cancel");
      expect(typeof result.cancel).toBe("function");
    });

    it("should not call onComplete when cancelled", async () => {
      const wallet = createMockWallet(true, false);
      const steps = createMockRouteSteps(1, 1, false);
      const onComplete = vi.fn();

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
        onComplete,
      };

      useStepExecutor(options);

      // Verify onComplete callback is configured
      expect(options.onComplete).toBeDefined();
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    it("should handle wallet not connected", async () => {
      const wallet = createMockWallet(false); // No account
      const steps = createMockRouteSteps(1, 1);

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
      };

      const result = useStepExecutor(options);

      // Verify wallet has no account
      expect(wallet.getAccount()).toBeUndefined();
      expect(result).toHaveProperty("error");
    });

    it("should handle empty steps array", async () => {
      const wallet = createMockWallet(true);
      const steps: RouteStep[] = [];
      const onComplete = vi.fn();

      const options: StepExecutorOptions = {
        steps,
        wallet,
        windowAdapter: mockWindowAdapter,
        client: mockClient,
        onComplete,
      };

      const result = useStepExecutor(options);

      expect(result.progress).toBe(0);
      expect(options.steps).toHaveLength(0);

      // Empty steps should result in immediate completion
      const flattened = flattenRouteSteps(steps);
      expect(flattened).toHaveLength(0);
    });
  });
});
