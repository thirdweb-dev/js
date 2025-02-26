import {
  KafkaJS,
  type ProducerGlobalConfig,
} from "@confluentinc/kafka-javascript";

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
  private producer: KafkaJS.Producer;
  private isConnected = false;

  constructor(options: {
    /**
     * A descriptive name for your service. Example: "storage-server"
     */
    producerName: string;
    /**
     * A comma-separated list of `host[:port]` Kafka servers.
     */
    kafkaServers: string;
    username: string;
    password: string;

    /**
     * Configuration for the Kafka producer.
     */
    config?: ProducerGlobalConfig;
  }) {
    const { producerName, kafkaServers, username, password, config } = options;

    this.producer = new KafkaJS.Kafka({}).producer({
      "client.id": producerName,
      "bootstrap.servers": kafkaServers,
      "security.protocol": "sasl_ssl",
      "sasl.mechanisms": "PLAIN",
      "sasl.username": username,
      "sasl.password": password,
      "compression.codec": "lz4",
      "allow.auto.create.topics": true,
      // All configuration can be overridden.
      ...config,
    });
  }

  /**
   * Connects the producer. Can be called explicitly at the start of your service, or will be called automatically when sending messages.
   */
  async connect() {
    await this.producer.connect();
    this.isConnected = true;
  }

  /**
   * Send messages to a Kafka topic.
   * This method may throw. To call this non-blocking:
   * ```ts
   * void kafka.send(topic, events).catch((e) => console.error(e))
   * ```
   *
   * @param topic
   * @param messages
   */
  async send(
    topic: string,
    messages: Record<string, unknown>[],
  ): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.producer.send({
      topic,
      messages: messages.map((m) => ({
        value: JSON.stringify(m),
      })),
    });
  }

  /**
   * Disconnects KafkaProducer.
   * Useful when shutting down the service to flush in-flight events.
   */
  async disconnect() {
    if (this.isConnected) {
      try {
        await this.producer.flush();
        await this.producer.disconnect();
      } catch {}
      this.isConnected = false;
    }
  }
}
