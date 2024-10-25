import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_B } from "../../../test/src/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { name } from "../common/read/name.js";
import { deployERC1155Contract } from "./deploy-erc1155.js";

const account = TEST_ACCOUNT_B;

describe.runIf(process.env.TW_SECRET_KEY)("deployERC1155", () => {
  it("should deploy ERC1155 drop", async () => {
    const address = await deployERC1155Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account,
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
      account,
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
