import { createThirdwebClient } from "thirdweb";

export const thirdwebClient = createThirdwebClient({
  // biome-ignore lint/style/noNonNullAssertion: will throw error internally if not set
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
  // will only exist in the server environment, but that is fine
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});
