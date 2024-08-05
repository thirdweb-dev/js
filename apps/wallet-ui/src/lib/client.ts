import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient(
  process.env.THIRDWEB_SECRET_KEY
    ? { secretKey: process.env.THIRDWEB_SECRET_KEY as string }
    : { clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string },
);
