import { randomUUID } from "node:crypto";
import {
  type UsageV2Event,
  type UsageV2Source,
  getTopicName,
} from "../core/usageV2.js";
import { KafkaProducer, type KafkaProducerSendOptions } from "./kafka.js";

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
     * The environment the service is running in.
     */
    environment: "development" | "production";
    /**
     * The product where usage is coming from.
     */
    source: UsageV2Source;
    /**
     * Whether to compress the events.
     */
    shouldCompress?: boolean;

    username: string;
    password: string;
  }) {
    this.kafkaProducer = new KafkaProducer({
      producerName: config.producerName,
      environment: config.environment,
      shouldCompress: config.shouldCompress,
      username: config.username,
      password: config.password,
    });
    this.topic = getTopicName(config.source);
  }

  /**
   * Send usageV2 events.
   * This method may throw. To call this non-blocking:
   * @param events
   */
  async sendEvents(
    events: UsageV2Event[],
    /**
     * Reference: https://kafka.js.org/docs/producing#producing-messages
     */
    options?: KafkaProducerSendOptions,
  ): Promise<void> {
    const parsedEvents = events.map((event) => ({
      ...event,
      id: event.id ?? randomUUID(),
      created_at: event.created_at ?? new Date(),
      // Remove the "team_" prefix, if any.
      team_id: event.team_id.startsWith("team_")
        ? event.team_id.slice(5)
        : event.team_id,
    }));
    await this.kafkaProducer.send(this.topic, parsedEvents, options);
  }

  /**
   * Disconnects UsageV2Producer.
   * Useful when shutting down the service to flush in-flight events.
   */
  async disconnect() {
    await this.kafkaProducer.disconnect();
  }
}
