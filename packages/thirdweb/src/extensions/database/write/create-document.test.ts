import { beforeEach, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { getDatabases } from "../read/get-databases.js";
import { getDocument } from "../read/get-document.js";
import { FieldStatus, FieldType } from "../types.js";
import { createCollection } from "./create-collection.js";
import { createDatabase } from "./create-database.js";
import { createDocument } from "./create-document.js";

describe.runIf(process.env.TW_SECRET_KEY)("createDocument", () => {
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

    await createCollection({
      database,
      name: "users",
      schema: [
        {
          name: "username",
          type: FieldType.STRING,
          status: [FieldStatus.INDEXED],
        },
      ],
      account: TEST_ACCOUNT_A,
    });
  });

  it("creates a new document", async () => {
    const user = {
      username: "alice",
    };

    await createDocument(user, {
      account: TEST_ACCOUNT_A,
      database,
      collection: "users",
    });

    const document = await getDocument(0, {
      database,
      collection: "users",
    });

    expect(document).toEqual(user);
  });
});
