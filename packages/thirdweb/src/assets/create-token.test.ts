import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../test/src/test-wallets.js";
import { getContract } from "../contract/contract.js";
import { name } from "../extensions/common/read/name.js";
// import { totalSupply } from "../extensions/erc20/__generated__/IERC20/read/totalSupply.js";
import { createTokenByImplConfig } from "./create-token-by-impl-config.js";

describe.runIf(process.env.TW_SECRET_KEY)("create token by impl config", () => {
  it("should create token without pool", async () => {
    const token = await createTokenByImplConfig({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        maxSupply: 10_00n,
        name: "Test",
      },
      salt: "salt123",
    });

    expect(token).toBeDefined();

    const tokenName = await name({
      contract: getContract({
        address: token,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      }),
    });
    expect(tokenName).to.eq("Test");

    // const supply = await totalSupply({
    //   contract: getContract({
    //     client: TEST_CLIENT,
    //     chain: ANVIL_CHAIN,
    //     address: token,
    //   }),
    // });

    // console.log("supply: ", supply);
  });
});
