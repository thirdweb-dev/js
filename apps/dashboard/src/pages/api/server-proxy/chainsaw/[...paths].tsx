import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};
const handler = async (req: NextRequest) => {
  if (!process.env.CHAINSAW_API_KEY) {
    return new Response("CHAINSAW_API_KEY not set", { status: 401 });
  }

  // get the full path from the request including query params
  let pathname = req.nextUrl.pathname;

  // remove the /api/server-proxy prefix
  pathname = pathname.replace(/^\/api\/server-proxy\/chainsaw/, "");

  const searchParams = req.nextUrl.searchParams;
  searchParams.delete("paths");

  // create a new URL object for the chainsaw service
  // TODO: this should really point at dev vs prod based on the environment - but for now prod only will have to suffice
  const CHAINSAW_URL = new URL("https://chainsaw.thirdweb.com");
  CHAINSAW_URL.pathname = pathname;
  searchParams.forEach((value, key) => {
    CHAINSAW_URL.searchParams.append(key, value);
  });

  return fetch(CHAINSAW_URL, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      // pass the shared secret
      "x-service-api-key": process.env.CHAINSAW_API_KEY,
    },
    body: req.body,
  });
};

export default handler;
