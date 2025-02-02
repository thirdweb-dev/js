import type { ServiceName } from "../core/services.js";
import type { UsageV2Event } from "../core/usageV2.js";

/**
 * Send events to Kafka.
 * This method may throw. To call this non-blocking:
 *
 * ```ts
 * void sendUsageV2Events(events, {
 *   environment: "production",
 *   serviceKey: "..."
 * }).catch(console.error)
 * ```
 *
 * @param events - The events to send.
 * @param options.environment - The environment the service is running in.
 * @param options.serviceKey - The service key required for authentication.
 */
export async function sendUsageV2Events(
  events: UsageV2Event[],
  options: {
    environment: "development" | "production";
    productName: ServiceName;
    serviceKey: string;
  },
): Promise<void> {
  const baseUrl =
    options.environment === "production"
      ? "https://u.thirdweb.com"
      : "https://u.thirdweb-dev.com";

  const resp = await fetch(`${baseUrl}/usage-v2/${options.productName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-service-api-key": options.serviceKey,
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
