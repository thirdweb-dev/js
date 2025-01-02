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
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account,
      type: "OpenEditionERC721",
      params: {
        name: "OE",
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
    expect(deployedName).toBe("OE");
  });

  it("should deploy ERC721 drop", async () => {
    const address = await deployERC721Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account,
      type: "DropERC721",
      params: {
        name: "Drop",
        symbol: "DRP",
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
    expect(deployedName).toBe("Drop");
  });

  it("should deploy ERC721 token", async () => {
    const address = await deployERC721Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account,
      type: "TokenERC721",
      params: {
        name: "Token",
        symbol: "TKN",
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
    expect(deployedName).toBe("Token");
  });

  it("should deploy ERC721 loyalty card", async () => {
    const address = await deployERC721Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account,
      type: "LoyaltyCard",
      params: {
        name: "Loyalty",
        symbol: "LOY",
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
    expect(deployedName).toBe("Loyalty");
  });
});
