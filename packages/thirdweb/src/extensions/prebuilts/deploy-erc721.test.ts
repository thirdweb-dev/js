import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_B } from "../../../test/src/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { name } from "../common/read/name.js";
import { deployERC721Contract } from "./deploy-erc721.js";

const account = TEST_ACCOUNT_B;

describe.runIf(process.env.TW_SECRET_KEY)("deployERC721", () => {
  it("should deploy ERC721 open edition", async () => {
    const address = await deployERC721Contract({
      account,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "OE",
      },
      type: "OpenEditionERC721",
    });

    expect(address).toBeDefined();
    const deployedName = await name({
      contract: getContract({
        address,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      }),
    });
    expect(deployedName).toBe("OE");
  });

  it("should deploy ERC721 drop", async () => {
    const address = await deployERC721Contract({
      account,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "Drop",
        symbol: "DRP",
      },
      type: "DropERC721",
    });

    expect(address).toBeDefined();
    const deployedName = await name({
      contract: getContract({
        address,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      }),
    });
    expect(deployedName).toBe("Drop");
  });

  it("should deploy ERC721 token", async () => {
    const address = await deployERC721Contract({
      account,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "Token",
        symbol: "TKN",
      },
      type: "TokenERC721",
    });

    expect(address).toBeDefined();
    const deployedName = await name({
      contract: getContract({
        address,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      }),
    });
    expect(deployedName).toBe("Token");
  });

  it("should deploy ERC721 loyalty card", async () => {
    const address = await deployERC721Contract({
      account,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "Loyalty",
        symbol: "LOY",
      },
      type: "LoyaltyCard",
    });

    expect(address).toBeDefined();
    const deployedName = await name({
      contract: getContract({
        address,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      }),
    });
    expect(deployedName).toBe("Loyalty");
  });
});
