import "server-only";
import { ipAddress } from "@vercel/functions";
import { headers } from "next/headers";
import { TURNSTILE_SECRET_KEY } from "@/constants/server-envs";

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
      context: errors,
      error: "Could not get IP address. Please try again.",
    };
  }

  // https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
  // Validate the token by calling the "/siteverify" API endpoint.
  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      body: JSON.stringify({
        remoteip: ip,
        response: turnstileToken,
        secret: TURNSTILE_SECRET_KEY,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  const outcome = await result.json();

  return {
    success: outcome.success as boolean,
  };
}
