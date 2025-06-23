import { AwsClient } from "aws4fetch";
import { type UsageEvent, usageEventSchema } from "../core/usage.js";

export type { UsageEvent } from "../core/usage.js";

// Initialize a singleton for AWS usage.
let _aws: AwsClient | undefined;
function getAws(options: ConstructorParameters<typeof AwsClient>[0]) {
  if (!_aws) {
    _aws = new AwsClient(options);
  }
  return _aws;
}

/**
 * Publish usage events. Provide the relevant fields for your application.
 *
 * Usage in Cloudflare Workers:
 *    ctx.waitUntil(
 *      publishUsageEvents(
 *        [event1, event2],
 *        { queueUrl, accessKeyId, secretAccessKey },
 *      )
 *    )
 *
 * @param usageEvents
 * @param config
 */
async function publishUsageEvents(
  usageEvents: UsageEvent[],
  config: {
    queueUrl: string;
    accessKeyId: string;
    secretAccessKey: string;
    region?: string;
  },
): Promise<void> {
  const {
    queueUrl,
    accessKeyId,
    secretAccessKey,
    region = "us-west-2",
  } = config;

  const entries = usageEvents.map((event) => {
    // Enforce schema of usage event.
    const parsed = usageEventSchema.parse(event);
    return {
      Id: crypto.randomUUID(),
      MessageBody: JSON.stringify(parsed),
    };
  });

  const aws = getAws({
    accessKeyId,
    region,
    secretAccessKey,
  });
  await aws.fetch(`https://sqs.${region}.amazonaws.com`, {
    body: JSON.stringify({
      Entries: entries,
      QueueUrl: queueUrl,
    }),
    headers: {
      "Content-Type": "application/x-amz-json-1.0",
      "X-Amz-Date": new Date().toISOString(),
      "X-Amz-Target": "AmazonSQS.SendMessageBatch",
    },
  });
}

export { publishUsageEvents };
