import "server-only";

import { DASHBOARD_THIRDWEB_SECRET_KEY } from "./server-envs";
import { getConfiguredThirdwebClient } from "./thirdweb.server";

// During build time, the secret key might not be available
// Create a client that will work for build but may fail at runtime if secret key is needed
export const serverThirdwebClient = getConfiguredThirdwebClient({
  secretKey: DASHBOARD_THIRDWEB_SECRET_KEY || "dummy-build-time-secret",
  teamId: undefined,
});
