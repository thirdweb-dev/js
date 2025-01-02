import { createThirdwebClient } from "../client/client.js";

const clientId = process.env.STORYBOOK_CLIENT_ID;

if (!clientId) {
  throw new Error("STORYBOOK_CLIENT_ID env is not configured");
}

export const storyClient = createThirdwebClient({
  clientId: clientId,
});
