import { describe, it, expect } from "vitest";
import { FORKED_ETHEREUM_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareDeployTransactionFromMetadata } from "./deploy-from-metadata.js";
import { fetchPublishedContractMetadata } from "./publisher.js";
import { getDeployedCloneFactoryContract } from "./utils/clone-factory.js";

describe("deployFromMetadata", () => {
  it("should prepare deploy transaction for a published contract", async () => {
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
      publisher: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
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
});
