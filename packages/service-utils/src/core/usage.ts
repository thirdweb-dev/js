import { z } from "zod";
import {
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { AwsCredentialIdentity } from "@smithy/types";
import { randomUUID } from "crypto";

let sqs: SQSClient | undefined;

function getSqs({
  region,
  credentials,
}: {
  region: string;
  credentials?: AwsCredentialIdentity;
}): SQSClient {
  if (!sqs) {
    sqs = new SQSClient({ region, credentials });
  }
  return sqs;
}

/**
 * Types
 */
const usageEventSchema = z.object({
  source: z.enum([
    "wallet",
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
  transactionHash: z.string().optional(),
  gasLimit: z.number().nonnegative().optional(),
  gasPricePerUnit: z.number().nonnegative().optional(),
});
export type UsageEvent = z.infer<typeof usageEventSchema>;

/**
 * Publish usage events. Provide the relevant fields for your application.
 *
 * @param usageEvents
 * @param config
 */
export async function publishUsageEvents(
  usageEvents: UsageEvent[],
  config: {
    queueUrl: string;
    region?: string;
    credentials?: AwsCredentialIdentity;
  },
): Promise<void> {
  const { queueUrl, region = "us-west-2", credentials } = config;

  const entries = usageEvents.map((event) => ({
    Id: randomUUID(),
    MessageBody: JSON.stringify(usageEventSchema.parse(event)),
  })) as unknown as SendMessageBatchRequestEntry[];

  const input = new SendMessageBatchCommand({
    QueueUrl: queueUrl,
    Entries: entries,
  });
  await getSqs({ region, credentials }).send(input);
}
