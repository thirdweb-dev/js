import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  DASHBOARD_THIRDWEB_SECRET_KEY,
  IPFS_GATEWAY_URL,
} from "@/constants/env";
import { createThirdwebClient } from "thirdweb";

export const thirdwebClient = createThirdwebClient(
  DASHBOARD_THIRDWEB_SECRET_KEY
    ? {
        secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
        config: {
          storage: {
            gatewayUrl: IPFS_GATEWAY_URL,
          },
        },
      }
    : {
        clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
        config: {
          storage: {
            gatewayUrl: IPFS_GATEWAY_URL,
          },
        },
      },
);

/**
 * DO NOT ADD ANYTHING TO THIS FILE IF YOU ARE NOT ABSOLUTELY SURE IT IS OK
 */
