import { cookies } from "next/headers";
import {
  NEBULA_COOKIE_ACTIVE_ACCOUNT,
  NEBULA_COOKIE_PREFIX_TOKEN,
} from "@/constants/cookies";

export async function getNebulaAuthToken() {
  const cookiesManager = await cookies();
  const activeAccount = cookiesManager.get(NEBULA_COOKIE_ACTIVE_ACCOUNT)?.value;
  const token = activeAccount
    ? cookiesManager.get(NEBULA_COOKIE_PREFIX_TOKEN + activeAccount)?.value
    : null;

  return token;
}

export async function getNebulaAuthTokenWalletAddress() {
  const cookiesManager = await cookies();
  const activeAccount = cookiesManager.get(NEBULA_COOKIE_ACTIVE_ACCOUNT)?.value;

  if (!activeAccount) {
    return null;
  }

  const token = cookiesManager.get(
    NEBULA_COOKIE_PREFIX_TOKEN + activeAccount,
  )?.value;

  if (token) {
    return activeAccount;
  }

  return null;
}
