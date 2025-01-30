import { randomUUID } from "node:crypto";
import { checkServerIdentity } from "node:tls";
import * as KafkaJS from "kafkajs";
import LZ4Codec from "kafkajs-lz4";
import type { ServiceName } from "../core/services.js";
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
  private kafka: KafkaJS.Kafka;
  private producer: KafkaJS.Producer | null = null;
  private topic: string;
  private compression: KafkaJS.CompressionTypes;

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
    /**
     * The compression algorithm to use.
     */
    compression?: KafkaJS.CompressionTypes;

    username: string;
    password: string;
  }) {
    const {
      producerName,
      environment,
      productName,
      compression = KafkaJS.CompressionTypes.LZ4,
      username,
      password,
    } = config;

    this.kafka = new KafkaJS.Kafka({
      clientId: `${producerName}-${environment}`,
      brokers:
        environment === "production"
          ? ["warpstream.thirdweb.xyz:9092"]
          : ["warpstream-dev.thirdweb.xyz:9092"],
      ssl: {
        checkServerIdentity(hostname, cert) {
          return checkServerIdentity(hostname.toLowerCase(), cert);
        },
      },
      sasl: {
        mechanism: "plain",
        username,
        password,
      },
    });

    this.topic = getTopicName(productName);
    this.compression = compression;
  }

  /**
   * Connect the producer.
   * This must be called before calling `sendEvents()`.
   */
  async init(configOverrides?: KafkaJS.ProducerConfig) {
    if (this.compression === KafkaJS.CompressionTypes.LZ4) {
      KafkaJS.CompressionCodecs[KafkaJS.CompressionTypes.LZ4] =
        new LZ4Codec().codec;
    }

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false,
      ...configOverrides,
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
  async sendEvents(
    events: UsageV2Event[],
    /**
     * Reference: https://kafka.js.org/docs/producing#producing-messages
     */
    configOverrides?: {
      acks?: number;
      timeout?: number;
    },
  ): Promise<void> {
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
      topic: this.topic,
      messages: parsedEvents.map((event) => ({
        value: JSON.stringify(event),
      })),
      acks: -1, // All brokers must acknowledge
      timeout: 10_000, // 10 seconds
      compression: this.compression,
      ...configOverrides,
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
