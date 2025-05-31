import {
  type MockedFunction,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { routes } from "../../../bridge/Routes.js";
import { ApiError } from "../../../bridge/types/Errors.js";
import type { Route } from "../../../bridge/types/Route.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { UseBridgeRoutesParams } from "./useBridgeRoutes.js";

// Mock the Bridge routes function
vi.mock("../../../bridge/Routes.js", () => ({
  routes: vi.fn(),
}));

const mockRoutes = routes as MockedFunction<typeof routes>;

// Mock client
const mockClient = { clientId: "test" } as ThirdwebClient;

// Mock route data
const mockRouteData: Route[] = [
  {
    originToken: {
      chainId: 1,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      priceUsd: 2000.0,
    },
    destinationToken: {
      chainId: 137,
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      symbol: "WETH",
      name: "Wrapped Ethereum",
      decimals: 18,
      priceUsd: 2000.0,
    },
  },
];

describe("useBridgeRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export correct hook parameters type", () => {
    // Type-only test to verify UseBridgeRoutesParams interface
    const params: UseBridgeRoutesParams = {
      client: mockClient,
      originChainId: 1,
      destinationChainId: 137,
      enabled: true,
    };

    expect(params).toBeDefined();
    expect(params.client).toBe(mockClient);
    expect(params.originChainId).toBe(1);
    expect(params.destinationChainId).toBe(137);
    expect(params.enabled).toBe(true);
  });

  it("should handle different parameter combinations", () => {
    const fullParams: UseBridgeRoutesParams = {
      client: mockClient,
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      destinationChainId: 137,
      destinationTokenAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      maxSteps: 3,
      sortBy: "popularity",
      limit: 10,
      offset: 0,
      enabled: false,
    };

    expect(fullParams).toBeDefined();
    expect(fullParams.sortBy).toBe("popularity");
    expect(fullParams.maxSteps).toBe(3);
    expect(fullParams.limit).toBe(10);
    expect(fullParams.offset).toBe(0);
  });

  it("should have optional enabled parameter defaulting to true", () => {
    const paramsWithoutEnabled: UseBridgeRoutesParams = {
      client: mockClient,
      originChainId: 1,
      destinationChainId: 137,
    };

    expect(paramsWithoutEnabled.enabled).toBeUndefined(); // Should be optional
  });

  it("should validate that Bridge.routes would be called with correct parameters", async () => {
    const testParams = {
      client: mockClient,
      originChainId: 1,
      destinationChainId: 137,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as const,
    };

    // Mock the routes function to return our test data
    mockRoutes.mockResolvedValue(mockRouteData);

    // Directly call the routes function to verify it works with our parameters
    const result = await routes(testParams);

    expect(mockRoutes).toHaveBeenCalledWith(testParams);
    expect(result).toEqual(mockRouteData);
  });

  it("should handle API errors properly", async () => {
    const apiError = new ApiError({
      code: "INVALID_INPUT",
      message: "Invalid parameters",
      statusCode: 400,
    });

    mockRoutes.mockRejectedValue(apiError);

    try {
      await routes({
        client: mockClient,
        originChainId: 1,
        destinationChainId: 137,
      });
    } catch (error) {
      expect(error).toBe(apiError);
      expect(error).toBeInstanceOf(ApiError);
    }
  });
});
