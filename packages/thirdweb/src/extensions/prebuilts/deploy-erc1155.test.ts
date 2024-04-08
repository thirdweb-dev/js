import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { name } from "../common/read/name.js";
import { deployERC1155Contract } from "./deploy-erc1155.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("deployERC1155", () => {
  it("should deploy ERC1155 drop", async () => {
    const address = await deployERC1155Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "DropERC1155",
      params: {
        name: "EditionDrop",
        symbol: "NFTD",
      },
    });
    expect(address).toBeDefined();
    const deployedName = await name({
      contract: getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      }),
    });
    expect(deployedName).toBe("EditionDrop");
  });

  it("should deploy ERC1155 token", async () => {
    const address = await deployERC1155Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "TokenERC1155",
      params: {
        name: "Edition",
      },
    });
    expect(address).toBeDefined();
    const deployedName = await name({
      contract: getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      }),
    });
    expect(deployedName).toBe("Edition");
  });
});
