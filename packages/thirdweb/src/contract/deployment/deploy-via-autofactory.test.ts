import { describe, it, expect } from "vitest";
import {
  ANVIL_CHAIN,
  FORKED_ETHEREUM_CHAIN,
} from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { getDeployedCloneFactoryContract } from "./utils/clone-factory.js";
import { deployImplementation, deployCloneFactory } from "./utils/bootstrap.js";
import { prepareAutoFactoryDeployTransaction } from "./deploy-via-autofactory.js";
import { initialize } from "../../extensions/prebuilts/__generated__/DropERC721/write/initialize.js";
import { getDeployedInfraContract } from "./utils/infra.js";

describe("deployFromMetadata", () => {
  it("should deploy published contract with existing infra", async () => {
    const cloneFactoryContract = await getDeployedCloneFactoryContract({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
    });
    if (!cloneFactoryContract) {
      throw new Error("Clone factory not found");
    }
    const implementationContract = await getDeployedInfraContract({
      chain: FORKED_ETHEREUM_CHAIN,
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
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      cloneFactoryContract,
      initializeTransaction,
    });
    const hash = await sendTransaction({
      transaction,
      account: TEST_ACCOUNT_A,
    });
    expect(hash.transactionHash).toBe(
      "0xca716193f5448ec52dafef9451ee5afabc8770a5303195a3977a94705d8101d1",
    );
  });

  it("should deploy published contract with no existing infra", async () => {
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
    expect(hash.transactionHash).toBe(
      "0x531b94f7554b7c7ac5d72db3583e6997559ffa2acdc0d9afea1002c15db0632b",
    );
  });
});
