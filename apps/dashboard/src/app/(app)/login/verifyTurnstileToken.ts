import "server-only";
import { ipAddress } from "@vercel/functions";
import { headers } from "next/headers";

export async function verifyTurnstileToken(turnstileToken: string) {
  // get the request headers
  const requestHeaders = await headers();

  // CF header, fallback to req.ip, then X-Forwarded-For
  const [ip, errors] = (() => {
    let ip: string | null = null;
    const errors: string[] = [];
    try {
      ip = requestHeaders.get("CF-Connecting-IP") || null;
    } catch (err) {
      console.error("failed to get IP address from CF-Connecting-IP", err);
      errors.push("failed to get IP address from CF-Connecting-IP");
    }
    if (!ip) {
      try {
        ip = ipAddress(requestHeaders) || null;
      } catch (err) {
        console.error(
          "failed to get IP address from ipAddress() function",
          err,
        );
        errors.push("failed to get IP address from ipAddress() function");
      }
    }
    if (!ip) {
      try {
        ip = requestHeaders.get("X-Forwarded-For");
      } catch (err) {
        console.error("failed to get IP address from X-Forwarded-For", err);
        errors.push("failed to get IP address from X-Forwarded-For");
      }
    }
    return [ip, errors];
  })();

  if (!ip) {
    return {
      error: "Could not get IP address. Please try again.",
      context: errors,
    };
  }

  // https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
  // Validate the token by calling the "/siteverify" API endpoint.
  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: ip,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const outcome = await result.json();

  return {
    success: outcome.success as boolean,
  };
}
