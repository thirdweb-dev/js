export type UsageV2Source =
  | "bundler"
  | "engine"
  | "insight"
  | "nebula"
  | "rpc"
  | "sdk"
  | "storage"
  | "wallet";
export function getTopicName(source: UsageV2Source) {
  return `usage_v2.raw_${source}`;
}

export interface UsageV2Event {
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
   * The team ID.
   */
  team_id: string;
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
   * An object of arbitrary key-value pairs.
   * Values can be boolean, number, string, Date, or null.
   */
  [key: string]: boolean | number | string | Date | null | undefined;
}
