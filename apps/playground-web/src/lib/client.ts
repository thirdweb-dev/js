import { createThirdwebClient } from "thirdweb";

export const THIRDWEB_CLIENT = createThirdwebClient(
  process.env.THIRDWEB_SECRET_KEY
    ? { secretKey: process.env.THIRDWEB_SECRET_KEY }
    : {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
      },
);
