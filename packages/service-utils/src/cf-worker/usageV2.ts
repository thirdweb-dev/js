import { Headers, type Request, fetch } from "@cloudflare/workers-types";
import type { CoreAuthInput } from "src/core/types.js";
import type {
  ClientUsageV2Event,
  UsageV2Event,
  UsageV2Source,
} from "../core/usageV2.js";

type UsageV2Options = {
  usageBaseUrl: string;
  source: UsageV2Source;
  authInput: CoreAuthInput & { req: Request };
  serviceKey?: string;
};

/**
 * Send usageV2 events from either internal services or public clients.
 *
 * This method may throw. To call this non-blocking:
 * ```ts
 * void sendUsageV2Events(...).catch((e) => console.error(e))
 * ```
 */
export async function sendUsageV2Events<T extends UsageV2Options>(
  events: T extends { serviceKey: string }
    ? UsageV2Event[]
    : ClientUsageV2Event[],
  options: T,
): Promise<void> {
  const { usageBaseUrl, source, authInput, serviceKey } = options;

  // Forward headers from the origin request.
  // Determine endpoint and auth header based on provided credentials.
  let url: string;
  const headers = new Headers(authInput.req.headers);
  headers.set("Content-Type", "application/json");
  if (serviceKey) {
    // If a service key is provided, call the non-public usage endpoint.
    url = `${usageBaseUrl}/usage-v2/${source}`;
    headers.set("x-service-api-key", serviceKey);
  } else {
    url = `${usageBaseUrl}/usage-v2/${source}/client`;
  }

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ events }),
  });
  if (!resp.ok) {
    throw new Error(
      `[UsageV2] Unexpected response ${resp.status}: ${await resp.text()}`,
    );
  }
  resp.body?.cancel();
}
