import { checkServerIdentity } from "node:tls";
import { CompressionTypes, Kafka, type Producer } from "kafkajs";
import { compress, decompress } from "lz4js";

// CompressionCodecs is not exported properly in kafkajs. Source: https://github.com/tulios/kafkajs/issues/1391
import KafkaJS from "kafkajs";
const { CompressionCodecs } = KafkaJS;

/**
 * Reference: https://kafka.js.org/docs/producing#producing-messages
 */
export interface KafkaProducerSendOptions {
  // Per-message settings.
  acks?: number;
  timeout?: number;

  // Per-producer settings.
  retries?: number;
  allowAutoTopicCreation?: boolean;
  maxInFlightRequests?: number;
}

/**
 * Creates a KafkaProducer which opens a persistent TCP connection.
 * This class is thread-safe so your service should re-use one instance.
 *
 * Example:
 * ```ts
 * kafka = new KafkaProducer(...)
 * await kafka.send(topic, events)
 * // Non-blocking:
 * // void kafka.send(topic, events).catch((e) => console.error(e))
 * ```
 */
export class KafkaProducer {
  private kafka: Kafka;
  private producer: Producer | null = null;
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
     * Whether to compress the events.
     */
    shouldCompress?: boolean;

    username: string;
    password: string;
  }) {
    const {
      producerName,
      environment,
      shouldCompress = true,
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

    if (shouldCompress) {
      this.compression = CompressionTypes.LZ4;

      CompressionCodecs[CompressionTypes.LZ4] = () => ({
        // biome-ignore lint/style/noRestrictedGlobals: kafkajs expects a Buffer
        compress: (encoder: { buffer: Buffer }) => {
          const compressed = compress(encoder.buffer);
          // biome-ignore lint/style/noRestrictedGlobals: kafkajs expects a Buffer
          return Buffer.from(compressed);
        },
        // biome-ignore lint/style/noRestrictedGlobals: kafkajs expects a Buffer
        decompress: (buffer: Buffer) => {
          const decompressed = decompress(buffer);
          // biome-ignore lint/style/noRestrictedGlobals: kafkajs expects a Buffer
          return Buffer.from(decompressed);
        },
      });
    } else {
      this.compression = CompressionTypes.None;
    }
  }

  /**
   * Send messages to a Kafka topic.
   * This method may throw. To call this non-blocking:
   * @param topic
   * @param messages
   * @param configOverrides
   */
  async send(
    topic: string,
    messages: Record<string, unknown>[],
    options?: KafkaProducerSendOptions,
  ): Promise<void> {
    if (!this.producer) {
      this.producer = this.kafka.producer({
        allowAutoTopicCreation: options?.allowAutoTopicCreation ?? false,
        maxInFlightRequests: options?.maxInFlightRequests ?? 2000,
        retry: { retries: options?.retries ?? 5 },
      });
      await this.producer.connect();
    }

    await this.producer.send({
      topic,
      messages: messages.map((m) => ({
        value: JSON.stringify(m),
      })),
      compression: this.compression,
      acks: options?.acks ?? -1, // Default: All brokers must acknowledge
      timeout: options?.timeout ?? 10_000, // Default: 10 seconds
    });
  }

  /**
   * Disconnects KafkaProducer.
   * Useful when shutting down the service to flush in-flight events.
   */
  async disconnect() {
    if (this.producer) {
      await this.producer.disconnect();
      this.producer = null;
    }
  }
}
