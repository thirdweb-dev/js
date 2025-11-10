import { readContract } from "src/transaction/read-contract.js";
import { resolveMethod } from "src/transaction/resolve-method.js";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../test/src/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { deployCloneFactory } from "../../../contract/deployment/utils/bootstrap.js";
import { deployPublishedContract } from "../../../extensions/prebuilts/deploy-published.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { installPublishedExtension } from "./installPublishedExtension.js";

describe.runIf(process.env.TW_SECRET_KEY)("install extension", () => {
  it.sequential("should install extension to a dynamic contract", async () => {
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

    const contract = getContract({
      address: deployed,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const transaction = installPublishedExtension({
      account: TEST_ACCOUNT_A,
      contract,
      extensionName: "DirectListingsLogic",
    });

    await sendTransaction({ account: TEST_ACCOUNT_A, transaction });

    const extensions = await readContract({
      contract,
      method: resolveMethod("getAllExtensions"),
      params: [],
    });

    expect(extensions.length).toEqual(4);
  });
});
