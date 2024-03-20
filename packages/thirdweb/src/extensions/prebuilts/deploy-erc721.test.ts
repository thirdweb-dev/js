import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { deployERC721Contract } from "./deploy-erc721.js";
import { getContract } from "../../contract/contract.js";
import { name } from "../common/read/name.js";

describe("deployERC721", () => {
  it("should deploy ERC721 drop", async () => {
    const address = await deployERC721Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "DropERC721",
      params: {
        name: "NFTDrop",
      },
    });
    expect(address).toBe("0xEd7AabAB416b5648E70adeEF8E23993E78C1A262");
    const deployedName = await name({
      contract: getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      }),
    });
    expect(deployedName).toBe("NFTDrop");
  });

  it("should deploy ERC721 token", async () => {
    const address = await deployERC721Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "TokenERC721",
      params: {
        name: "NFTCollection",
      },
    });
    expect(address).toBe("0x7fd58A0FbA992f73AF7B2B58eF032E184b3D495D");
    const deployedName = await name({
      contract: getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      }),
    });
    expect(deployedName).toBe("NFTCollection");
  });

  it("should deploy ERC721 open edition", async () => {
    const address = await deployERC721Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "OpenEditionERC721",
      params: {
        name: "OE",
      },
    });
    expect(address).toBe("0x1203e883fEc269fB855093f437a2819a28e2E952");
    const deployedName = await name({
      contract: getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      }),
    });
    expect(deployedName).toBe("OE");
  });
});
