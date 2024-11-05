import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import "server-only";

export async function fetchApiServer(
  input: string | URL,
  init?: RequestInit,
): Promise<Response> {
  const cookieManager = await cookies();
  const activeAccount = cookieManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authToken = activeAccount
    ? cookieManager.get(COOKIE_PREFIX_TOKEN + getAddress(activeAccount))?.value
    : null;

  const [pathname, searchParams] = input.toString().split("?");
  if (!pathname) {
    throw new Error("Invalid input, no pathname provided");
  }

  // create a new URL object for the analytics server
  const API_SERVER_URL = new URL(
    process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com",
  );
  API_SERVER_URL.pathname = pathname;
  for (const param of searchParams?.split("&") || []) {
    const [key, value] = param.split("=");
    if (!key || !value) {
      throw new Error("Invalid input, no key or value provided");
    }
    API_SERVER_URL.searchParams.append(
      decodeURIComponent(key),
      decodeURIComponent(value),
    );
  }

  return fetch(API_SERVER_URL, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
      ...init?.headers,
    },
  });
}
