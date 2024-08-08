import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { DEFAULT_DATABASE_FACTORY } from "../constants.js";
import { getDatabases } from "../read/get-databases.js";
import { createDatabase } from "./create-database.js";

describe.runIf(process.env.TW_SECRET_KEY)("createDatabase", () => {
  const databaseFactory = getContract({
    address: DEFAULT_DATABASE_FACTORY,
    chain: ANVIL_CHAIN,
    client: TEST_CLIENT,
  });

  it("should deploy a database", async () => {
    await createDatabase({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      account: TEST_ACCOUNT_A,
      name: "TEST",
    });

    const isFactoryDeployed = await isContractDeployed(databaseFactory);
    expect(isFactoryDeployed).toBe(true);

    const databases = await getDatabases({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      ownerAddress: TEST_ACCOUNT_A.address,
    });

    if (databases.length === 0) {
      throw new Error("No databases found");
    }

    const database = getContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      address: databases[0] as string,
    });
    expect(await isContractDeployed(database)).toBe(true);
  });
});
