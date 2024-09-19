import { type NextRequest, NextResponse } from "next/server";
import invariant from "tiny-invariant";
import { cacheGet, cacheSet } from "../../../lib/redis";
import type { ContactFormPayload } from "./types";

// Note: This handler cannot use "edge" runtime because of Redis usage.

export const POST = async (req: NextRequest) => {
  const rateLimitedResponse = await rateLimiter(req);
  if (rateLimitedResponse) {
    return rateLimitedResponse;
  }

  const requestBody = (await req.json()) as ContactFormPayload;

  const { fields } = requestBody;

  invariant(process.env.HUBSPOT_ACCESS_TOKEN, "missing HUBSPOT_ACCESS_TOKEN");

  const response = await fetch(
    "https://api.hsforms.com/submissions/v3/integration/secure/submit/23987964/38849262-3605-4eb2-883b-b4f1aa5ad845",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      method: "POST",
      body: JSON.stringify({ fields }),
    },
  );

  if (!response.ok) {
    const body = await response.json();
    console.error("error", body);
  }

  return NextResponse.json(
    { status: response.statusText },
    {
      status: response.status,
    },
  );
};

async function rateLimiter(req: NextRequest) {
  //  Max 1 requests per minute
  const rateLimitSeconds = 60;

  const ipAddress =
    req.headers.get("CF-Connecting-IP") ||
    req.ip ||
    req.headers.get("X-Forwarded-For");

  if (!ipAddress) {
    return NextResponse.json(
      {
        error: "Could not validate elligibility.",
      },
      { status: 400 },
    );
  }

  const cacheKey = `contact-us:${ipAddress}`;
  const cacheValue = await cacheGet(cacheKey);

  // if we have a cached value, return an error
  if (cacheValue !== null) {
    return NextResponse.json(
      {
        error: `Rate limit exceeded. Try again in ${rateLimitSeconds} seconds.`,
      },
      { status: 429 },
    );
  }

  // cache it for `rateLimitSeconds`
  await cacheSet(cacheKey, "contact-us-used", rateLimitSeconds);
}
