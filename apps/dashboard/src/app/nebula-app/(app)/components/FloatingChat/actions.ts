"use server";

import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../../(app)/api/lib/getAuthToken";
import { getNebulaLoginStatus } from "../../../_utils/isLoggedIntoNebula";
import {
  doNebulaLogin,
  getNebulaLoginPayload,
} from "../../../login/auth-actions";

export async function getNebulaAuthToken() {
  const [dashboardAuthToken, dashboardAuthTokenAddress] = await Promise.all([
    getAuthToken(),
    getAuthTokenWalletAddress(),
  ]);

  // if not logged in to dashboard
  if (!dashboardAuthToken || !dashboardAuthTokenAddress) {
    return undefined;
  }

  const nebulaLoginStatus = await getNebulaLoginStatus();

  // if already logged in to nebula
  if (nebulaLoginStatus.isLoggedIn) {
    return nebulaLoginStatus.authToken;
  }

  // automatically login to nebula with the dashboard auth token ---
  const loginPayload = await getNebulaLoginPayload({
    address: dashboardAuthTokenAddress,
    chainId: 1,
  });

  if (!loginPayload) {
    return undefined;
  }

  const result = await doNebulaLogin({
    type: "floating-chat",
    loginPayload: {
      payload: loginPayload,
      token: dashboardAuthToken,
    },
  });

  if (result.success) {
    return result.token;
  }

  return undefined;
}
