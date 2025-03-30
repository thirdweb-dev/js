import { readContract } from "src/transaction/read-contract.js";
import { resolveMethod } from "src/transaction/resolve-method.js";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { deployPublishedContract } from "../../extensions/prebuilts/deploy-published.js";
import { getContract } from "../contract.js";
import { deployCloneFactory } from "./utils/bootstrap.js";

describe.runIf(process.env.TW_SECRET_KEY)("deploy dynamic", () => {
  it.sequential("should deploy dynamic contract with extensions", async () => {
    await deployCloneFactory({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      account: TEST_ACCOUNT_A,
    });

    const deployed = await deployPublishedContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      account: TEST_ACCOUNT_A,
      contractId: "EvolvingNFT",
      contractParams: {
        name: "Evolving nft",
        symbol: "ENFT",
        defaultAdmin: TEST_ACCOUNT_A.address,
        royaltyBps: 0n,
        royaltyRecipient: TEST_ACCOUNT_A.address,
        saleRecipient: TEST_ACCOUNT_A.address,
        trustedForwarders: [],
        contractURI: "",
      },
    });

    expect(deployed).toBeDefined();

    const contract = getContract({
      client: TEST_CLIENT,
      address: deployed,
      chain: ANVIL_CHAIN,
    });

    const extensions = await readContract({
      contract,
      method: resolveMethod("getAllExtensions"),
      params: [],
    });

    expect(extensions.length).toEqual(3);
  });
});
