import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { initialize } from "../../extensions/prebuilts/__generated__/DropERC721/write/initialize.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareAutoFactoryDeployTransaction } from "./deploy-via-autofactory.js";
import { deployCloneFactory, deployImplementation } from "./utils/bootstrap.js";
import { getDeployedCloneFactoryContract } from "./utils/clone-factory.js";
import { getDeployedInfraContract } from "./utils/infra.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("deployFromMetadata", () => {
  it.sequential(
    "should deploy published contract with no existing infra",
    async () => {
      // bootstrap infra and implementation
      await deployCloneFactory({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        account: TEST_ACCOUNT_A,
      });
      await deployImplementation({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        account: TEST_ACCOUNT_A,
        contractId: "DropERC721",
      });

      const cloneFactoryContract = await getDeployedCloneFactoryContract({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      if (!cloneFactoryContract) {
        throw new Error("Clone factory not found");
      }
      const implementationContract = await getDeployedInfraContract({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "DropERC721",
        constructorParams: [],
      });
      if (!implementationContract) {
        throw new Error("Clone factory not found");
      }

      const initializeTransaction = initialize({
        contract: implementationContract,
        name: "NFTDrop unified",
        symbol: "NFTD",
        defaultAdmin: TEST_ACCOUNT_A.address,
        platformFeeBps: 0n,
        platformFeeRecipient: TEST_ACCOUNT_A.address,
        royaltyBps: 0n,
        royaltyRecipient: TEST_ACCOUNT_A.address,
        saleRecipient: TEST_ACCOUNT_A.address,
        trustedForwarders: [],
        contractURI: "",
      });

      const transaction = prepareAutoFactoryDeployTransaction({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        cloneFactoryContract,
        initializeTransaction,
      });
      const hash = await sendTransaction({
        transaction,
        account: TEST_ACCOUNT_A,
      });
      expect(hash.transactionHash).toBeDefined();
    },
  );

  it.sequential(
    "should deploy published contract with existing infra",
    async () => {
      const cloneFactoryContract = await getDeployedCloneFactoryContract({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      if (!cloneFactoryContract) {
        throw new Error("Clone factory not found");
      }
      const implementationContract = await getDeployedInfraContract({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "DropERC721",
        constructorParams: [],
      });
      if (!implementationContract) {
        throw new Error("Clone factory not found");
      }

      const initializeTransaction = initialize({
        contract: implementationContract,
        name: "NFTDrop unified",
        symbol: "NFTD",
        defaultAdmin: TEST_ACCOUNT_A.address,
        platformFeeBps: 0n,
        platformFeeRecipient: TEST_ACCOUNT_A.address,
        royaltyBps: 0n,
        royaltyRecipient: TEST_ACCOUNT_A.address,
        saleRecipient: TEST_ACCOUNT_A.address,
        trustedForwarders: [],
        contractURI: "",
      });

      const transaction = prepareAutoFactoryDeployTransaction({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        cloneFactoryContract,
        initializeTransaction,
      });
      const hash = await sendTransaction({
        transaction,
        account: TEST_ACCOUNT_A,
      });
      expect(hash.transactionHash).toBeDefined();
    },
  );
});
