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
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const deployed = await deployPublishedContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      contractId: "EvolvingNFT",
      contractParams: {
        contractURI: "",
        defaultAdmin: TEST_ACCOUNT_A.address,
        name: "Evolving nft",
        royaltyBps: 0n,
        royaltyRecipient: TEST_ACCOUNT_A.address,
        saleRecipient: TEST_ACCOUNT_A.address,
        symbol: "ENFT",
        trustedForwarders: [],
      },
    });

    expect(deployed).toBeDefined();

    const contract = getContract({
      address: deployed,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const extensions = await readContract({
      contract,
      method: resolveMethod("getAllExtensions"),
      params: [],
    });

    expect(extensions.length).toEqual(3);
  });
});
