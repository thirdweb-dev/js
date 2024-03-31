import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
  api: {
    bodyParser: false,
  },
};
const handler = async (req: NextRequest) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url).searchParams.get("url");
  if (!url) {
    return new Response("missing url", { status: 400 });
  }

  if (Array.isArray(url)) {
    return new Response("missing url", { status: 400 });
  }

  const resp = await fetch(url);
  return new Response(resp.body, {
    headers: {
      "cache-control": "public, max-age=29030400, s-maxage=29030400, immutable",
    },
  });
};

export default handler;
