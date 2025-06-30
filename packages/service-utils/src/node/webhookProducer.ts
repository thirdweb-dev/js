import assert from "node:assert";
import { createId } from "@paralleldrive/cuid2";
import type { KafkaProducer } from "./kafka.js";

/**
 * The event schema for webhook events.
 * See more: https://github.com/thirdweb-dev/api-server/blob/dev/docs/webhooks.md
 */
interface WebhookEvent extends Record<string, unknown> {
  id?: `evt_${string}`;
  teamId: string;
  projectId?: string;
  /**
   * The timestamp your event was triggered at.
   */
  createdAt?: Date;
  /**
   * Your model defined in api-server.
   */
  data: Record<string, unknown>;
}

/**
 * Creates a producer for webhook events.
 *
 * Example:
 * ```ts
 * const kafkaProducer = new KafkaProducer({...});
 * const webhookProducer = new WebhookEventProducer({ kafkaProducer });
 * await webhookProducer.sendEvents("your.topic.name", events);
 * ```
 */
export class WebhookEventProducer {
  private kafkaProducer: KafkaProducer;

  constructor(config: { kafkaProducer: KafkaProducer }) {
    this.kafkaProducer = config.kafkaProducer;
  }

  /**
   * Emit a webhook event.
   * This method may throw. To call this non-blocking:
   * ```ts
   * void webhookProducer.sendEvents(events).catch((e) => console.error(e))
   * ```
   */
  async sendEvents(topic: string, events: WebhookEvent[]): Promise<void> {
    const parsedEvents: WebhookEvent[] = events.map((event) => {
      assert(
        event.teamId.startsWith("team_"),
        "teamId must start with 'team_'",
      );
      assert(
        !event.projectId || event.projectId.startsWith("prj_"),
        "projectId must start with 'prj_'",
      );

      return {
        ...event,
        // Default to now.
        createdAt: event.createdAt ?? new Date(),
        // Default to a generated UUID.
        id: event.id ?? `evt_${createId()}`,
      };
    });
    await this.kafkaProducer.send(topic, parsedEvents);
  }
}
