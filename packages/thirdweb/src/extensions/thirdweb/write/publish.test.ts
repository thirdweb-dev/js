import { describe, expect, it } from "vitest";
import { FORKED_POLYGON_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_D } from "../../../../test/src/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { CONTRACT_PUBLISHER_ADDRESS } from "../../../contract/deployment/publisher.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { download } from "../../../storage/download.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import {
  type FetchDeployMetadataResult,
  fetchDeployMetadata,
} from "../../../utils/any-evm/deploy-metadata.js";
import { contractPublishedEvent } from "../__generated__/IContractPublisher/events/ContractPublished.js";
import { getAllPublishedContracts } from "../__generated__/IContractPublisher/read/getAllPublishedContracts.js";
import { getPublishedContractVersions } from "../__generated__/IContractPublisher/read/getPublishedContractVersions.js";
import { publishContract } from "./publish.js";

describe.runIf(process.env.TW_SECRET_KEY).sequential("publishContract", () => {
  const publisherContract = getContract({
    client: TEST_CLIENT,
    chain: FORKED_POLYGON_CHAIN,
    address: CONTRACT_PUBLISHER_ADDRESS,
  });
  let publishedData: FetchDeployMetadataResult;

  it("should publish a contract successfully", async () => {
    const publishedContracts = await getAllPublishedContracts({
      contract: publisherContract,
      publisher: TEST_ACCOUNT_D.address,
    });

    expect(publishedContracts.length).toBe(0);

    const catAttackDeployMetadata = await fetchDeployMetadata({
      client: TEST_CLIENT,
      uri: "ipfs://QmWcAMvBy49WRrzZeK4EQeVnkdmyb5H4STz4gUQwnt1kzC",
    });

    const tx = publishContract({
      contract: publisherContract,
      account: TEST_ACCOUNT_D,
      metadata: {
        ...catAttackDeployMetadata,
        version: "0.0.1",
        description: "Cat Attack NFT",
        changelog: "Initial release",
      },
    });
    const result = await sendAndConfirmTransaction({
      transaction: tx,
      account: TEST_ACCOUNT_D,
    });
    expect(result.transactionHash.length).toBeGreaterThan(0);
    const logs = parseEventLogs({
      events: [contractPublishedEvent()],
      logs: result.logs,
    });
    expect(logs?.[0]?.args.publishedContract.contractId).toBe("CatAttackNFT");
    expect(logs?.[0]?.args.publishedContract.publishMetadataUri).toBeDefined();
    const rawMeta = await download({
      client: TEST_CLIENT,
      uri: logs?.[0]?.args.publishedContract.publishMetadataUri ?? "",
    }).then((r) => r.json());
    expect(rawMeta).toMatchInlineSnapshot(`
      {
        "bytecodeUri": "ipfs://QmVyB9qAs7XdZYNGPcNbff43BX1tyZFJkqdfp1eXiNS8AG/0",
        "changelog": "Initial release",
        "compilers": {
          "solc": [
            {
              "bytecodeUri": "ipfs://QmVyB9qAs7XdZYNGPcNbff43BX1tyZFJkqdfp1eXiNS8AG/0",
              "compilerVersion": "",
              "evmVersion": "",
              "metadataUri": "ipfs://Qmd2Ef29NzCjomqYXZbWa8ZdF1AESDAS1HDAonmAnTgHPs",
            },
          ],
        },
        "description": "Cat Attack NFT",
        "metadataUri": "ipfs://Qmd2Ef29NzCjomqYXZbWa8ZdF1AESDAS1HDAonmAnTgHPs",
        "name": "CatAttackNFT",
        "publisher": "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        "routerType": "none",
        "version": "0.0.1",
      }
    `);
    publishedData = await fetchDeployMetadata({
      client: TEST_CLIENT,
      uri: logs?.[0]?.args.publishedContract.publishMetadataUri ?? "",
    });
    expect(publishedData.abi).toBeDefined();
    expect(publishedData.version).toBe("0.0.1");
    expect(publishedData.changelog).toBe("Initial release");
    expect(publishedData.name).toBe("CatAttackNFT");
    expect(publishedData.description).toBe("Cat Attack NFT");
    expect(publishedData.publisher).toBe(TEST_ACCOUNT_D.address);
    expect(publishedData.routerType).toBe("none");
  }, 120000);

  it("should throw if publishing the same version", async () => {
    const publishedContracts = await getAllPublishedContracts({
      contract: publisherContract,
      publisher: TEST_ACCOUNT_D.address,
    });

    expect(publishedContracts.length).toBe(1);

    expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_D,
        transaction: publishContract({
          contract: publisherContract,
          account: TEST_ACCOUNT_D,
          previousMetadata: publishedData,
          metadata: {
            ...publishedData,
            version: "0.0.1",
            changelog: "Initial release 2",
          },
        }),
      }),
    ).rejects.toThrow("Version 0.0.1 is not greater than 0.0.1");
  });

  it("should publish a new version", async () => {
    const tx2 = publishContract({
      contract: publisherContract,
      account: TEST_ACCOUNT_D,
      previousMetadata: publishedData,
      metadata: {
        ...publishedData,
        version: "0.0.2",
        changelog: "Initial release 2",
      },
    });
    const result2 = await sendAndConfirmTransaction({
      transaction: tx2,
      account: TEST_ACCOUNT_D,
    });

    expect(result2.transactionHash.length).toBeGreaterThan(0);
    const logs2 = parseEventLogs({
      events: [contractPublishedEvent()],
      logs: result2.logs,
    });
    expect(logs2?.[0]?.args.publishedContract.contractId).toBe("CatAttackNFT");
    expect(logs2?.[0]?.args.publishedContract.publishMetadataUri).toBeDefined();
    const publishedData2 = await fetchDeployMetadata({
      client: TEST_CLIENT,
      uri: logs2?.[0]?.args.publishedContract.publishMetadataUri ?? "",
    });
    expect(publishedData2.version).toBe("0.0.2");

    const publishedContracts = await getAllPublishedContracts({
      contract: publisherContract,
      publisher: TEST_ACCOUNT_D.address,
    });

    expect(publishedContracts.length).toBe(1);

    const versions = await getPublishedContractVersions({
      contract: publisherContract,
      contractId: "CatAttackNFT",
      publisher: TEST_ACCOUNT_D.address,
    });

    expect(versions.length).toEqual(2);
  }, 120000);
});
