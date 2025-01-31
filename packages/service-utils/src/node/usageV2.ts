import { randomUUID } from "node:crypto";
import { checkServerIdentity } from "node:tls";
import { codec as lz4Codec } from "kafka-lz4-lite";
import {
  CompressionTypes,
  Kafka,
  type Producer,
  type ProducerConfig,
} from "kafkajs";
import type { ServiceName } from "../core/services.js";
import { type UsageV2Event, getTopicName } from "../core/usageV2.js";

// Import KafkaJS with CJS pattern (source: https://github.com/tulios/kafkajs/issues/1391)
import KafkaJS from "kafkajs";
const { CompressionCodecs } = KafkaJS;

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
  private topic: string;
  private compression: CompressionTypes;

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
    compression?: CompressionTypes;

    username: string;
    password: string;
  }) {
    const {
      producerName,
      environment,
      productName,
      compression = CompressionTypes.LZ4,
      username,
      password,
    } = config;

    this.kafka = new Kafka({
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
  async init(configOverrides?: ProducerConfig) {
    if (this.compression === CompressionTypes.LZ4) {
      CompressionCodecs[CompressionTypes.LZ4] = lz4Codec;
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
