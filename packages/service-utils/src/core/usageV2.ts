export const USAGE_V2_SOURCES = [
  "bundler",
  "engine", // Engine Core -- treat as a client-side event
  "engine-cloud", // Engine Cloud
  "insight",
  "nebula",
  "rpc",
  "sdk",
  "storage",
  "wallet",
  "pay",
  "webhook",
] as const;
export type UsageV2Source = (typeof USAGE_V2_SOURCES)[number];

export function getTopicName(source: UsageV2Source) {
  switch (source) {
    // Some sources are sent from clients and are written to an "untrusted" table.
    case "sdk":
    case "engine":
      return `usage_v2.untrusted_raw_${source}`;
    case "engine-cloud":
      return "usage_v2.raw_engine";
    default:
      return `usage_v2.raw_${source}`;
  }
}

export interface ClientUsageV2Event {
  /**
   * A unique identifier for the event. Defaults to a random UUID.
   * Useful if your service retries sending events.
   */
  id?: `${string}-${string}-${string}-${string}-${string}`;
  /**
   * The event timestamp. Defaults to now().
   */
  created_at?: Date;
  /**
   * The action of the event. Example: "upload"
   */
  action: string;
  /**
   * The project ID, if available.
   */
  project_id?: string;
  /**
   * The SDK name, if available.
   */
  sdk_name?: string;
  /**
   * The SDK platform, if available.
   */
  sdk_platform?: string;
  /**
   * The SDK version, if available.
   */
  sdk_version?: string;
  /**
   * The SDK OS, if available.
   */
  sdk_os?: string;
  /**
   * The product name, if available.
   */
  product_name?: string;
  /**
   * The product version, if available.
   */
  product_version?: string;
  /**
   * The event version. Defaults to 1.
   */
  version?: number;
  /**
   * An object of arbitrary key-value pairs.
   * Values can be boolean, number, string, Date, or null.
   */
  [key: string]: boolean | number | string | Date | null | undefined;
}

export interface UsageV2Event extends ClientUsageV2Event {
  /**
   * The team ID.
   */
  team_id: string;
}
