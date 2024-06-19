import { createThirdwebClient } from "thirdweb";
import { DASHBOARD_THIRDWEB_CLIENT_ID, IPFS_GATEWAY_URL } from "./env";

export const thirdwebClient = createThirdwebClient({
  clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
  config: {
    storage: {
      gatewayUrl: IPFS_GATEWAY_URL,
    },
  },
});
