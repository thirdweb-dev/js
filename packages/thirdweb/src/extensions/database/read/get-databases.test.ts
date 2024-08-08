import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A, TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { prepareDeterministicDeployTransaction } from "../../../contract/deployment/deploy-deterministic.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { generateAccount } from "../../../wallets/utils/generateAccount.js";
import { DEFAULT_DATABASE_FACTORY } from "../constants.js";
import { createDatabase } from "../write/create-database.js";
import { getDatabases } from "./get-databases.js";

describe.runIf(process.env.TW_SECRET_KEY)("getDatabases", () => {
  it("should return empty array for chain with no database factory", async () => {
    const databases = await getDatabases({
      ownerAddress: TEST_ACCOUNT_A.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    expect(databases).toEqual([]);
  });

  it("should throw if ownerAddress is invalid", async () => {
    const databasesPromise = getDatabases({
      ownerAddress: "0xdead",
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    await expect(databasesPromise).rejects.toThrowError(
      "getDatabases: Invalid ownerAddress 0xdead",
    );
  });

  describe.sequential("with a deployed factory", async () => {
    beforeAll(async () => {
      const isFactoryDeployed = await isContractDeployed({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        address: DEFAULT_DATABASE_FACTORY,
      });

      if (!isFactoryDeployed) {
        const deployFactoryTx = prepareDeterministicDeployTransaction({
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
          contractId: "DatabaseFactory",
          constructorParams: [],
          publisher: "0x4a706de5CE9bfe2f9C37BA945805e396d1810824",
          // Excluding the specific version to always use latest
        });

        await sendAndConfirmTransaction({
          transaction: deployFactoryTx,
          account: TEST_ACCOUNT_B,
        });
      }
    });

    it("should return an empty array for an address with no databases", async () => {
      const account = await generateAccount({ client: TEST_CLIENT }); // We generate a fresh account to guarantee it has no databases
      const databases = await getDatabases({
        ownerAddress: account.address,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });

      expect(databases).toEqual([]);
    });

    it("should return created databases", async () => {
      await createDatabase({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        name: "TEST",
      });

      const databases = await getDatabases({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        ownerAddress: TEST_ACCOUNT_A.address,
      });

      expect(databases).length.greaterThanOrEqual(1);
    });
  });
});
