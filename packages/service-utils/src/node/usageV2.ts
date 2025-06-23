import { randomUUID } from "node:crypto";
import {
  getTopicName,
  type UsageV2Event,
  type UsageV2Source,
} from "../core/usageV2.js";
import { KafkaProducer } from "./kafka.js";

const TEAM_ID_PREFIX = "team_";
const PROJECT_ID_PREFIX = "prj_";

/**
 * Creates a UsageV2Producer which opens a persistent TCP connection.
 * This class is thread-safe so your service should re-use one instance.
 *
 * Example:
 * ```ts
 * usageV2 = new UsageV2Producer(..)
 * await usageV2.sendEvents(events)
 * // Non-blocking:
 * // void usageV2.sendEvents(events).catch((e) => console.error(e))
 * ```
 */
export class UsageV2Producer {
  private kafkaProducer: KafkaProducer;
  private topic: string;

  constructor(config: {
    /**
     * A descriptive name for your service. Example: "storage-server"
     */
    producerName: string;
    /**
     * A comma-separated list of `host[:port]` Kafka servers.
     */
    kafkaServers: string;
    /**
     * The product where usage is coming from.
     */
    source: UsageV2Source;

    username: string;
    password: string;
  }) {
    this.kafkaProducer = new KafkaProducer({
      kafkaServers: config.kafkaServers,
      password: config.password,
      producerName: config.producerName,
      username: config.username,
    });
    this.topic = getTopicName(config.source);
  }

  /**
   * Send usageV2 events.
   * This method may throw. To call this non-blocking:
   * ```ts
   * void usageV2.sendEvents(events).catch((e) => console.error(e))
   * ```
   *
   * @param events
   */
  async sendEvents(events: UsageV2Event[]): Promise<void> {
    const parsedEvents = events.map((event) => ({
      ...event,
      // Default to now.
      created_at: event.created_at ?? new Date(),
      // Default to a generated UUID.
      id: event.id ?? randomUUID(),
      // Remove the "prj_" prefix, if any.
      project_id: event.project_id?.startsWith(PROJECT_ID_PREFIX)
        ? event.project_id.slice(PROJECT_ID_PREFIX.length)
        : event.project_id,
      // Remove the "team_" prefix, if any.
      team_id: event.team_id.startsWith(TEAM_ID_PREFIX)
        ? event.team_id.slice(TEAM_ID_PREFIX.length)
        : event.team_id,
    }));
    await this.kafkaProducer.send(this.topic, parsedEvents);
  }

  /**
   * Disconnects UsageV2Producer.
   * Useful when shutting down the service to flush in-flight events.
   */
  async disconnect() {
    await this.kafkaProducer.disconnect();
  }
}
