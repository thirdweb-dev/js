import { randomUUID } from "node:crypto";
import { checkServerIdentity } from "node:tls";
import { Kafka, type Producer } from "kafkajs";
import type { ServiceName } from "src/core/services.js";
import { type UsageV2Event, getTopicName } from "../core/usageV2.js";

/**
 * Creates a UsageV2Producer which opens a persistent TCP connection.
 * This class is thread-safe so your service should re-use one instance.
 *
 * Example:
 * ```ts
 * usageV2 = new UsageV2Producer(..)
 * await usageV2.init()
 * await usageV2.sendEvents(events)
 * // Non-blocking:
 * // void usageV2.sendEvents(events).catch(console.error)
 * ```
 */
export class UsageV2Producer {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private productName: ServiceName;

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
     * The product "source" where usage is coming from.
     */
    productName: ServiceName;

    username: string;
    password: string;
  }) {
    this.kafka = new Kafka({
      clientId: `${config.producerName}-${config.environment}`,
      brokers:
        config.environment === "production"
          ? ["warpstream.thirdweb.xyz:9092"]
          : ["warpstream-dev.thirdweb.xyz:9092"],
      ssl: {
        checkServerIdentity(hostname, cert) {
          return checkServerIdentity(hostname.toLowerCase(), cert);
        },
      },
      sasl: {
        mechanism: "plain",
        username: config.username,
        password: config.password,
      },
    });

    this.productName = config.productName;
  }

  /**
   * Connect the producer.
   * This must be called before calling `sendEvents()`.
   */
  async init() {
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false,
    });
    await this.producer.connect();
  }

  /**
   * Send usageV2 events.
   * This method may throw. To call this non-blocking:
   *
   * ```ts
   * usageV2 = new UsageV2Producer(...)
   * void usageV2.sendEvents(events).catch(console.error)
   *
   * @param events - The events to send.
   */
  async sendEvents(events: UsageV2Event[]): Promise<void> {
    if (!this.producer) {
      throw new Error("Producer not initialized. Call `init()` first.");
    }

    const parsedEvents = events.map((event) => {
      return {
        ...event,
        id: event.id ?? randomUUID(),
        created_at: event.created_at ?? new Date(),
        // Remove the "team_" prefix, if any.
        team_id: event.team_id.startsWith("team_")
          ? event.team_id.slice(5)
          : event.team_id,
      };
    });

    await this.producer.send({
      topic: getTopicName(this.productName),
      messages: parsedEvents.map((event) => ({
        value: JSON.stringify(event),
      })),
    });
  }

  /**
   * Disconnects UsageV2Producer.
   * Useful when shutting down the service to flush in-flight events.
   */
  async disconnect() {
    if (this.producer) {
      await this.producer.disconnect();
      this.producer = null;
    }
  }
}
