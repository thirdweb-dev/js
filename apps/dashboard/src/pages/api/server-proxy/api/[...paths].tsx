import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import type { NextRequest } from "next/server";
import { getAddress } from "thirdweb";

export const config = {
  runtime: "edge",
};
const handler = async (req: NextRequest) => {
  const activeAccount = req.cookies.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authToken = activeAccount
    ? req.cookies.get(COOKIE_PREFIX_TOKEN + getAddress(activeAccount))?.value
    : null;

  // get the full path from the request including query params
  let pathname = req.nextUrl.pathname;

  // remove the /api/server-proxy prefix
  pathname = pathname.replace(/^\/api\/server-proxy\/api/, "");

  const searchParams = req.nextUrl.searchParams;
  searchParams.delete("paths");

  // create a new URL object for the API server
  const API_SERVER_URL = new URL(
    process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com",
  );
  API_SERVER_URL.pathname = pathname;
  searchParams.forEach((value, key) => {
    API_SERVER_URL.searchParams.append(key, value);
  });

  return fetch(API_SERVER_URL, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      // pass the auth token if we have one
      ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
    },
    body: req.body,
  });
};

export default handler;
