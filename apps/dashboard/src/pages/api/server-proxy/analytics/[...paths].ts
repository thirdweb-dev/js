import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};
const handler = async (req: NextRequest) => {
  // get the full path from the request including query params
  let pathname = req.nextUrl.pathname;

  // remove the /api/server-proxy prefix
  pathname = pathname.replace(/^\/api\/server-proxy\/analytics/, "");

  const searchParams = req.nextUrl.searchParams;
  searchParams.delete("paths");

  // create a new URL object for the analytics server
  const API_SERVER_URL = new URL(
    process.env.ANALYTICS_SERVICE_URL || "https://analytics.thirdweb.com",
  );
  API_SERVER_URL.pathname = pathname;
  searchParams.forEach((value, key) => {
    API_SERVER_URL.searchParams.append(key, value);
  });

  return fetch(API_SERVER_URL, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.ANALYTICS_SERVICE_API_KEY}`,
    },
    body: req.body,
  });
};

export default handler;
