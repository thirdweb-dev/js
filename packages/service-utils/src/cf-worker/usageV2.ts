import type {
  ClientUsageV2Event,
  UsageV2Event,
  UsageV2Source,
} from "../core/usageV2.js";

type UsageV2Options = {
  usageBaseUrl: string;
  source: UsageV2Source;
} & (
  | { serviceKey: string; thirdwebClientId?: never; thirdwebSecretKey?: never }
  | { serviceKey?: never; thirdwebClientId: string; thirdwebSecretKey?: never }
  | { serviceKey?: never; thirdwebClientId?: never; thirdwebSecretKey: string }
);

/**
 * Send usageV2 events from either internal services or public clients.
 *
 * Exactly one authentication method must be provided:
 * - serviceKey: for internal services
 * - thirdwebClientId: for public clients (MUST be the user's project)
 * - thirdwebSecretKey: for public clients (MUST be the user's project)
 *
 * NOTE: `team_id` is required if `serviceKey` is provided.
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
  // Determine endpoint and auth header based on provided credentials.
  let url: string;
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (options.serviceKey) {
    url = `${options.usageBaseUrl}/usage-v2/${options.source}`;
    headers["x-service-api-key"] = options.serviceKey;
  } else if (options.thirdwebSecretKey) {
    url = `${options.usageBaseUrl}/usage-v2/${options.source}/client`;
    headers["x-secret-key"] = options.thirdwebSecretKey;
  } else if (options.thirdwebClientId) {
    url = `${options.usageBaseUrl}/usage-v2/${options.source}/client`;
    headers["x-client-id"] = options.thirdwebClientId;
  } else {
    throw new Error("[UsageV2] No authentication method provided.");
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
