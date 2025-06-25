import { randomUUID } from "node:crypto";
import {
  getTopicName,
  type UsageV2Event,
  type UsageV2Source,
} from "../core/usageV2.js";
import { KafkaProducer } from "./kafka.js";

/**
 * Creates a producer for usage events.
 *
 * Example:
 * ```ts
 * const kafkaProducer = new KafkaProducer({...});
 * const usageV2 = new UsageV2Producer({ kafkaProducer, source: "storage" });
 * await usageV2.sendEvents(events);
 * ```
 */
export class UsageV2Producer {
  private kafkaProducer: KafkaProducer;
  private topic: string;

  constructor(
    config:
      | {
          /**
           * Shared KafkaProducer instance.
           */
          kafkaProducer: KafkaProducer;
          /**
           * The product where usage is coming from.
           */
          source: UsageV2Source;
        }
      | {
          /**
           * A descriptive name for your service. Example: "storage-server"
           */
          producerName: string;
          /**
           * A comma-separated list of `host[:port]` Kafka servers.
           * @deprecated: Instantiate and pass in `kafkaProducer` instead.
           */
          kafkaServers: string;
          /**
           * The product where usage is coming from.
           */
          source: UsageV2Source;
          username: string;
          password: string;
        },
  ) {
    if ("kafkaProducer" in config) {
      this.kafkaProducer = config.kafkaProducer;
    } else {
      this.kafkaProducer = new KafkaProducer({
        kafkaServers: config.kafkaServers,
        password: config.password,
        producerName: config.producerName,
        username: config.username,
      });
    }
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
    const parsedEvents: UsageV2Event[] = events.map((event) => ({
      ...event,
      // Default to now.
      created_at: event.created_at ?? new Date(),
      // Default to a generated UUID.
      id: event.id ?? randomUUID(),
      // Remove the "prj_" prefix.
      project_id: event.project_id?.startsWith("prj_")
        ? event.project_id.slice(4)
        : event.project_id,
      // Remove the "team_" prefix.
      team_id: event.team_id.startsWith("team_")
        ? event.team_id.slice(5)
        : event.team_id,
    }));
    await this.kafkaProducer.send(this.topic, parsedEvents);
  }
}
