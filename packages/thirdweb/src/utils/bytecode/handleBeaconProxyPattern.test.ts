import type { EIP1193RequestFn, EIP1474Methods } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { getBytecode } from "../../contract/actions/get-bytecode.js";
import { eth_getStorageAt } from "../../rpc/actions/eth_getStorageAt.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { resolveImplementation } from "./resolveImplementation.js";

// Mock dependencies
vi.mock("../../contract/actions/get-bytecode.js");
vi.mock("../../rpc/rpc.js");
vi.mock("../../rpc/actions/eth_getStorageAt.js");

describe.runIf(process.env.TW_SECRET_KEY)(
  "Handle beacon proxy pattern",
  async () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should handle beacon proxy pattern with short storage values", async () => {
      // This test verifies that the implementation can handle short storage values
      // which was the original issue we were trying to fix
      const mockContract = {
        address: "0x0000000000000000000000000000000000000001",
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      } as const;

      // Mock getBytecode to return a minimal proxy bytecode that will trigger the beacon check
      const mockGetBytecode = vi
        .fn()
        .mockResolvedValueOnce("") // First call for proxy (empty bytecode triggers beacon check)
        .mockResolvedValueOnce("0x1234"); // Second call for implementation

      vi.mocked(getBytecode).mockImplementation(mockGetBytecode);

      // Mock eth_getStorageAt to return a short value
      const mockRpcRequest = { request: vi.fn() };
      vi.mocked(getRpcClient).mockReturnValue(
        mockRpcRequest as unknown as EIP1193RequestFn<EIP1474Methods>,
      );
      vi.mocked(eth_getStorageAt).mockResolvedValue("0x1234"); // Short storage value

      const result = await resolveImplementation(mockContract);

      // Should not throw and should return some result (even if it's the original address)
      expect(result).toBeDefined();
      expect(result.address).toBeDefined();
    });
  },
);
