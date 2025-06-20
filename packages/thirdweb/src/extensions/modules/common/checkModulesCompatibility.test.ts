import { describe, expect, it } from "vitest";
import { CLAIMABLE_ERC20_MODULE_BYTECODE } from "../../../../test/src/bytecode/claimable-erc20.js";
import { CLAIMABLE_ERC721_BYTECODE } from "../../../../test/src/bytecode/claimable-erc721.js";
import { ERC20_CORE_BYTECODE } from "../../../../test/src/bytecode/erc20core.js";
import { MINTABLE_ERC20_BYTECODE } from "../../../../test/src/bytecode/mintable-erc20.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { checkModulesCompatibility } from "./checkModulesCompatibility.js";

describe("compatibleModules", () => {
  it("should return true for compatible modules", async () => {
    const result = await checkModulesCompatibility({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      coreBytecode: ERC20_CORE_BYTECODE,
      moduleBytecodes: [CLAIMABLE_ERC20_MODULE_BYTECODE],
    });

    expect(result).toBe(true);
  });

  it("should return false for incompatible modules", async () => {
    const result = await checkModulesCompatibility({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      coreBytecode: ERC20_CORE_BYTECODE,
      moduleBytecodes: [CLAIMABLE_ERC721_BYTECODE],
    });

    expect(result).toBe(false);
  });

  it("should return false for overlapping modules", async () => {
    const result = await checkModulesCompatibility({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      coreBytecode: ERC20_CORE_BYTECODE,
      moduleBytecodes: [
        CLAIMABLE_ERC20_MODULE_BYTECODE,
        MINTABLE_ERC20_BYTECODE,
      ],
    });

    expect(result).toBe(false);
  });
});
