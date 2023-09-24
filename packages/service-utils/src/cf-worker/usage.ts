import { AwsClient } from "aws4fetch";
import { z } from "zod";

// Initialize a singleton for aws usage.
let _aws: AwsClient | undefined;
function getAws(options: ConstructorParameters<typeof AwsClient>[0]) {
  if (!_aws) {
    _aws = new AwsClient(options);
  }
  return _aws;
}

/**
 * Types
 */
const usageEventSchema = z.object({
  source: z.enum([
    "embeddedWallets",
    "rpc",
    "storage",
    "bundler",
    "paymaster",
    "relayer",
  ]),
  action: z.string(),
  accountId: z.string(),

  // Optional
  apiKeyId: z.string().optional(),
  creatorWalletAddress: z.string().optional(),
  clientId: z.string().optional(),
  walletAddress: z.string().optional(),
  chainId: z.number().int().positive().optional(),
  provider: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().int().nonnegative().optional(),
  fileCid: z.string().optional(),
  evmMethod: z.string().optional(),
  userOpHash: z.string().optional(),
  gasLimit: z.number().nonnegative().optional(),
  gasPricePerUnit: z.string().optional(),
  transactionHash: z.string().optional(),
  sdkName: z.string().optional(),
  sdkVersion: z.string().optional(),
  sdkPlatform: z.string().optional(),
  productName: z.string().optional(),
});
export type UsageEvent = z.infer<typeof usageEventSchema>;

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
export async function publishUsageEvents(
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
    secretAccessKey,
    region,
  });
  await aws.fetch(`https://sqs.${region}.amazonaws.com`, {
    headers: {
      "X-Amz-Target": "AmazonSQS.SendMessageBatch",
      "X-Amz-Date": new Date().toISOString(),
      "Content-Type": "application/x-amz-json-1.0",
    },
    body: JSON.stringify({
      QueueUrl: queueUrl,
      Entries: entries,
    }),
  });
}
