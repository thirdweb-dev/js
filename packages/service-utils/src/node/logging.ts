import type { ServerResponse } from "http";
import { AuthInput, extractAuthorizationData } from ".";

export function logHttpRequest({
  source,
  clientId,
  req,
  res,
  isAuthed,
  error,
}: AuthInput & {
  source: string;
  res: ServerResponse;
  isAuthed?: boolean;
  error?: any;
}) {
  const authorizationData = extractAuthorizationData({ req, clientId });

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
