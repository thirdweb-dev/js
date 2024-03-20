import { describe, it, expect } from "vitest";
import {
  ANVIL_CHAIN,
  FORKED_ETHEREUM_CHAIN,
} from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareDeployTransactionFromMetadata } from "./deploy-from-metadata.js";
import { fetchPublishedContractMetadata } from "./publisher.js";
import { getDeployedCloneFactoryContract } from "./utils/clone-factory.js";
import {
  bootstrapImplementation,
  bootstrapOnchainInfra,
} from "./utils/bootstrap.js";

describe("deployFromMetadata", () => {
  it("should deploy published contract with existing infra", async () => {
    const cloneFactoryContract = await getDeployedCloneFactoryContract({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
    });
    if (!cloneFactoryContract) {
      throw new Error("Clone factory not found");
    }
    const contractMetadata = await fetchPublishedContractMetadata({
      client: TEST_CLIENT,
      contractId: "DropERC721",
    });
    const transaction = prepareDeployTransactionFromMetadata({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      cloneFactoryContract,
      contractMetadata,
      constructorParams: [
        TEST_ACCOUNT_A.address,
        "NFTDrop unified",
        "NFTD",
        "",
        [],
        TEST_ACCOUNT_A.address,
        TEST_ACCOUNT_A.address,
        0,
        0,
        TEST_ACCOUNT_A.address,
      ],
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
    await bootstrapOnchainInfra({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      account: TEST_ACCOUNT_A,
    });
    await bootstrapImplementation({
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
    const contractMetadata = await fetchPublishedContractMetadata({
      client: TEST_CLIENT,
      contractId: "DropERC721",
    });
    const transaction = prepareDeployTransactionFromMetadata({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      cloneFactoryContract,
      contractMetadata,
      constructorParams: [
        TEST_ACCOUNT_A.address,
        "NFTDrop unified",
        "NFTD",
        "",
        [],
        TEST_ACCOUNT_A.address,
        TEST_ACCOUNT_A.address,
        0,
        0,
        TEST_ACCOUNT_A.address,
      ],
    });
    const hash = await sendTransaction({
      transaction,
      account: TEST_ACCOUNT_A,
    });
    expect(hash.transactionHash).toBe(
      "0x3c2d91e0617837384180053ba1c03ab2ca11c10ab15c9995747e68ccbdfb9a65",
    );
  });
});
