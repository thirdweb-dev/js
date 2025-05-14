import "server-only";

import { DASHBOARD_THIRDWEB_SECRET_KEY } from "./server-envs";
import { getConfiguredThirdwebClient } from "./thirdweb.server";

export const serverThirdwebClient = getConfiguredThirdwebClient({
  teamId: undefined,
  secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
});
