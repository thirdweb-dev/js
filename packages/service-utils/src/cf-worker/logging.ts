// import { extractAuthorizationData } from ".";

import type { ServerResponse } from "http";
import { extractAuthorizationData } from ".";
import type { Request } from "@cloudflare/workers-types";

export async function logHttpRequest({
  source,
  req,
  res,
  isAuthed,
  error,
}: {
  source: string;
  req: Request;
  res: ServerResponse;
  isAuthed?: boolean;
  error?: any;
}) {
  const authorizationData = await extractAuthorizationData({ req });

  console.log(
    JSON.stringify({
      source,
      pathname: req.url,
      hasSecretKey: !!authorizationData.secretKey,
      hasClientId: !!authorizationData.clientId,
      hasJwt: !!authorizationData.jwt,
      clientId: authorizationData.clientId,
      isAuthed: !!isAuthed ?? null,
      status: res.statusCode,
    }),
  );

  if (error) {
    // Log to a separate line. Logpush has a character limit per log line.
    console.error("Request error:", error);
  }
}
