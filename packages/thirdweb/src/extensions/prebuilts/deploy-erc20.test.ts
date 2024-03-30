import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { deployERC20Contract } from "./deploy-erc20.js";
import { name } from "../common/read/name.js";
import { getContract } from "../../contract/contract.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.skipIf(!process.env.TW_SECRET_KEY)("deployERC20", () => {
  it("should deploy ERC20 drop", async () => {
    const address = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "DropERC20",
      params: {
        name: "TokenDrop",
        symbol: "NFTD",
      },
    });
    expect(address).toBe("0x61Ae22E7240C7e5853749AF49f2552CB8D7C3e35");
    const deployedName = await name({
      contract: getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      }),
    });
    expect(deployedName).toBe("TokenDrop");
  });

  it("should deploy ERC20 token", async () => {
    const address = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "TokenERC20",
      params: {
        name: "Token",
      },
    });
    expect(address).toBe("0x3E8437C96275E9873b0379c1e5d5F0998A9546e9");
    const deployedName = await name({
      contract: getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      }),
    });
    expect(deployedName).toBe("Token");
  });
});
