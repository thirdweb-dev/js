import { describe, expect, it } from "vitest";

import { readContract } from "src/transaction/read-contract.js";
import { resolveMethod } from "src/transaction/resolve-method.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../test/src/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { deployCloneFactory } from "../../../contract/deployment/utils/bootstrap.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { deployPublishedContract } from "../../prebuilts/deploy-published.js";
import { uninstallExtension } from "./uninstallExtension.js";

describe.runIf(process.env.TW_SECRET_KEY)("uninstall extension", () => {
  it.sequential(
    "should uninstall extension from a dynamic contract",
    async () => {
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

      const contract = getContract({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        address: deployed,
      });

      const transaction = uninstallExtension({
        account: TEST_ACCOUNT_A,
        contract,
        extensionName: "EvolvingNFTLogic",
      });

      await sendTransaction({ transaction, account: TEST_ACCOUNT_A });

      const extensions = await readContract({
        contract,
        method: resolveMethod("getAllExtensions"),
        params: [],
      });

      expect(extensions.length).toEqual(2);
    },
  );
});
