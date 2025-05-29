import "server-only";

import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "./public-envs";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "./server-envs";
import { getConfiguredThirdwebClient } from "./thirdweb.server";

export const serverThirdwebClient = getConfiguredThirdwebClient({
  teamId: undefined,
  secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
  clientId: NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
  type: "server",
});
