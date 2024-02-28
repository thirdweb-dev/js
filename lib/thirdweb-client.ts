import { createThirdwebClient } from "thirdweb";
import { DASHBOARD_THIRDWEB_CLIENT_ID } from "../constants/rpc";
import { IPFS_GATEWAY_URL } from "./sdk";

export const thirdwebClient = createThirdwebClient({
  clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
  config: {
    storage: {
      gatewayUrl: IPFS_GATEWAY_URL,
    },
  },
});
