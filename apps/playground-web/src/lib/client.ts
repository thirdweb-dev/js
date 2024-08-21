import { createThirdwebClient } from "thirdweb";
import { setThirdwebDomains } from "thirdweb/utils";

export const THIRDWEB_CLIENT = createThirdwebClient(
  process.env.THIRDWEB_SECRET_KEY
    ? { secretKey: process.env.THIRDWEB_SECRET_KEY }
    : {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
      },
);


setThirdwebDomains({
  pay: "pay-server-s25c-feature-new-pay-gateway.chainsaw-dev.zeet.app",
  rpc: "rpc.thirdweb-dev.com",
});

