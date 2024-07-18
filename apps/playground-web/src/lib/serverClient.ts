import { createThirdwebClient } from "thirdweb";

export const THIRDWEB_SERVER_CLIENT = createThirdwebClient({
  secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY as string,
});
