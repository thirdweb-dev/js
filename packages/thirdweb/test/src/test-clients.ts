import { createThirdwebClient } from "../../src/client/client.js";

const secretKey = process.env.TW_SECRET_KEY;

export const TEST_CLIENT = createThirdwebClient(
  secretKey
    ? { secretKey }
    : {
        clientId: "TEST",
        // if we don't have a secret key, we can use a public gateway for testing?
        config: { storage: { gatewayUrl: "https://cf-ipfs.com" } },
      },
);
