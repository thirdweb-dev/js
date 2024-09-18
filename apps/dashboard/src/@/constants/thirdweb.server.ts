import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  DASHBOARD_THIRDWEB_SECRET_KEY,
  IPFS_GATEWAY_URL,
} from "@/constants/env";
import { createThirdwebClient } from "thirdweb";

// returns a thirdweb client with optional JWT passed in
export function getThirdwebClient(jwt?: string) {
  return createThirdwebClient({
    secretKey: jwt ? jwt : DASHBOARD_THIRDWEB_SECRET_KEY,
    clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
    config: {
      storage: {
        gatewayUrl: IPFS_GATEWAY_URL,
      },
    },
  });
}

/**
 * DO NOT ADD ANYTHING TO THIS FILE IF YOU ARE NOT ABSOLUTELY SURE IT IS OK
 */
