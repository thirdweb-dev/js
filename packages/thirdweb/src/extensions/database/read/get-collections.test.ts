import { beforeEach, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { FieldStatus, FieldType } from "../types.js";
import { createCollection } from "../write/create-collection.js";
import { createDatabase } from "../write/create-database.js";
import { getCollections } from "./get-collections.js";
import { getDatabases } from "./get-databases.js";

describe.runIf(process.env.TW_SECRET_KEY)("getCollections", () => {
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

  it("returns an empty array if no collections exist in the database", async () => {
    const collections = await getCollections({ database });

    expect(collections.length).toEqual(0);
  });

  it("returns existing collections", async () => {
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
