import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { deployERC1155Contract } from "./deploy-erc1155.js";
import { name } from "../common/read/name.js";
import { getContract } from "../../contract/contract.js";

describe("deployERC1155", () => {
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
    expect(address).toBe("0x54dBb6D6520C84cdE0DA86c01b833F6f7304Db49");
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
    expect(address).toBe("0x089D499522A14C3bBf58F197324014a9a1a98981");
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
