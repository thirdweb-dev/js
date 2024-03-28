import { createThirdwebClient } from "../../src/client/client.js";

const secretKey = process.env.TW_SECRET_KEY;

export const TEST_CLIENT = createThirdwebClient(
  secretKey ? { secretKey } : { clientId: "TEST" },
);
