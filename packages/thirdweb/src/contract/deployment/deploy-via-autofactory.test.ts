import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { parseEventLogs } from "../../event/actions/parse-logs.js";
import { initialize } from "../../extensions/prebuilts/__generated__/DropERC721/write/initialize.js";
import { deployContractfromDeployMetadata } from "../../extensions/prebuilts/deploy-published.js";
import { proxyDeployedV2Event } from "../../extensions/thirdweb/__generated__/IContractFactory/events/ProxyDeployedV2.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { keccakId } from "../../utils/any-evm/keccak-id.js";
import { prepareAutoFactoryDeployTransaction } from "./deploy-via-autofactory.js";
import { fetchPublishedContractMetadata } from "./publisher.js";
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
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      await deployImplementation({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
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
      });
      if (!implementationContract) {
        throw new Error("Clone factory not found");
      }

      const initializeTransaction = initialize({
        contract: implementationContract,
        contractURI: "",
        defaultAdmin: TEST_ACCOUNT_A.address,
        name: "NFTDrop unified",
        platformFeeBps: 0n,
        platformFeeRecipient: TEST_ACCOUNT_A.address,
        royaltyBps: 0n,
        royaltyRecipient: TEST_ACCOUNT_A.address,
        saleRecipient: TEST_ACCOUNT_A.address,
        symbol: "NFTD",
        trustedForwarders: [],
      });

      const transaction = prepareAutoFactoryDeployTransaction({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        cloneFactoryContract,
        initializeTransaction,
      });
      const hash = await sendTransaction({
        account: TEST_ACCOUNT_A,
        transaction,
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
      });
      if (!implementationContract) {
        throw new Error("Clone factory not found");
      }

      const initializeTransaction = initialize({
        contract: implementationContract,
        contractURI: "",
        defaultAdmin: TEST_ACCOUNT_A.address,
        name: "NFTDrop unified",
        platformFeeBps: 0n,
        platformFeeRecipient: TEST_ACCOUNT_A.address,
        royaltyBps: 0n,
        royaltyRecipient: TEST_ACCOUNT_A.address,
        saleRecipient: TEST_ACCOUNT_A.address,
        symbol: "NFTD",
        trustedForwarders: [],
      });

      const transaction = prepareAutoFactoryDeployTransaction({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        cloneFactoryContract,
        initializeTransaction,
      });
      const hash = await sendTransaction({
        account: TEST_ACCOUNT_A,
        transaction,
      });
      expect(hash.transactionHash).toBeDefined();
    },
  );

  it.sequential("should deploy with crosschain option", async () => {
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
    });
    if (!implementationContract) {
      throw new Error("Clone factory not found");
    }

    const initializeTransaction = initialize({
      contract: implementationContract,
      contractURI: "",
      defaultAdmin: TEST_ACCOUNT_A.address,
      name: "NFTDrop unified",
      platformFeeBps: 0n,
      platformFeeRecipient: TEST_ACCOUNT_A.address,
      royaltyBps: 0n,
      royaltyRecipient: TEST_ACCOUNT_A.address,
      saleRecipient: TEST_ACCOUNT_A.address,
      symbol: "NFTD",
      trustedForwarders: [],
    });

    const transaction = prepareAutoFactoryDeployTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      cloneFactoryContract,
      initializeTransaction,
    });
    const receipt = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
    const proxyEvent = proxyDeployedV2Event();
    const decodedEvent = parseEventLogs({
      events: [proxyEvent],
      logs: receipt.logs,
    });

    const deployMetadata = await fetchPublishedContractMetadata({
      client: TEST_CLIENT,
      contractId: "DropERC721",
    });
    const deployed = await deployContractfromDeployMetadata({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      deployMetadata,
      initializeData: decodedEvent[0]?.args.data,
      isCrosschain: true,
    });

    expect(deployed).toBeDefined();
  });

  it.sequential("should generate salt based on input params", async () => {
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
    });
    if (!implementationContract) {
      throw new Error("Clone factory not found");
    }

    const initializeTransaction = initialize({
      contract: implementationContract,
      contractURI: "",
      defaultAdmin: TEST_ACCOUNT_A.address,
      name: "NFTDrop unified",
      platformFeeBps: 0n,
      platformFeeRecipient: TEST_ACCOUNT_A.address,
      royaltyBps: 0n,
      royaltyRecipient: TEST_ACCOUNT_A.address,
      saleRecipient: TEST_ACCOUNT_A.address,
      symbol: "NFTD",
      trustedForwarders: [],
    });

    let salt = "test";
    let transaction = prepareAutoFactoryDeployTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      cloneFactoryContract,
      initializeTransaction,
      salt,
    });
    let receipt = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
    let proxyEvent = proxyDeployedV2Event();
    let decodedEvent = parseEventLogs({
      events: [proxyEvent],
      logs: receipt.logs,
    });

    expect(decodedEvent[0]?.args.inputSalt).to.equal(keccakId("test"));

    salt = keccakId("test1");
    transaction = prepareAutoFactoryDeployTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      cloneFactoryContract,
      initializeTransaction,
      salt,
    });
    receipt = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
    proxyEvent = proxyDeployedV2Event();
    decodedEvent = parseEventLogs({
      events: [proxyEvent],
      logs: receipt.logs,
    });

    expect(decodedEvent[0]?.args.inputSalt).to.equal(keccakId("test1"));

    // deploy with crosschain option
    transaction = prepareAutoFactoryDeployTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      cloneFactoryContract,
      implementationAddress: implementationContract.address,
      initializeData: decodedEvent[0]?.args.data,
      isCrosschain: true,
      salt: keccakId("test2"),
    });
    receipt = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
    proxyEvent = proxyDeployedV2Event();
    decodedEvent = parseEventLogs({
      events: [proxyEvent],
      logs: receipt.logs,
    });

    expect(decodedEvent[0]?.args.inputSalt).to.equal(keccakId("test2"));
    expect(decodedEvent[0]?.args.implementation.toLowerCase()).to.equal(
      implementationContract.address.toLowerCase(),
    );
  });
});
