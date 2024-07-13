import { beforeEach, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { getCollections } from "../read/get-collections.js";
import { getDatabases } from "../read/get-databases.js";
import { FieldStatus, FieldType } from "../types.js";
import { createCollection } from "./create-collection.js";
import { createDatabase } from "./create-database.js";

describe.runIf(process.env.TW_SECRET_KEY)("createCollection", () => {
  let database: ThirdwebContract;
  beforeEach(async () => {
    await createDatabase({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      name: "TEST",
    });

    const databaseAddresses = await getDatabases({
      ownerAddress: TEST_ACCOUNT_A.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    if (databaseAddresses.length === 0)
      throw new Error("Failed to deploy database");

    database = getContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      address: databaseAddresses[0] as string,
    });
  });

  it("creates a new collection", async () => {
    const name = `${Math.random()}`;
    await createCollection({
      account: TEST_ACCOUNT_A,
      name,
      schema: [
        { name: "A", type: FieldType.STRING, status: [] },
        { name: "B", type: FieldType.UINT256, status: [FieldStatus.INDEXED] },
      ],
      database,
    });

    const collections = await getCollections({
      database,
    });

    expect(collections.includes(name)).toBe(true);
  });
});
