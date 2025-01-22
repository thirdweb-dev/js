import type { UsageV2Event } from "src/core/usageV2.js";

/**
 * Send events to Kafka.
 * This method may throw. To call this non-blocking:
 *
 * ```ts
 * sendUsageV2Events("production", events).catch(console.error)
 * ```
 *
 * @param environment - The environment the service is running in.
 * @param events - The events to send.
 */
export async function sendUsageV2Events(
  environment: "development" | "production",
  events: UsageV2Event[],
): Promise<void> {
  const baseUrl =
    environment === "production"
      ? "https://u.thirdweb.com"
      : "https://u.thirdweb-dev.com";

  const resp = await fetch(`${baseUrl}/usage-v2/raw-events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ events }),
  });

  if (!resp.ok) {
    throw new Error(
      `[UsageV2] unexpected response ${resp.status}: ${await resp.text()}`,
    );
  }
  resp.body?.cancel();
}
