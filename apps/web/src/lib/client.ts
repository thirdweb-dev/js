import { createThirdwebClient } from "thirdweb";

export const THIRDWEB_CLIENT = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
});
