import { createClient } from "../../src/client/client.js";

const secretKey = process.env.TW_SECRET_KEY;

export const TEST_CLIENT = createClient(
  secretKey ? { secretKey } : { clientId: "TEST" },
);
