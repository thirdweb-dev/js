import { z } from "zod";
import {
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { AwsCredentialIdentity } from "@smithy/types";

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

const usageEventsSchema = z.array(
  z.object({
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
    gasPriceWei: z.number().positive().optional(),
  }),
);

/**
 * Publish usage events. Provide the relevant fields for your application.
 *
 * @param usageEvents
 * @param config
 */
export async function publishUsageEvents(
  usageEvents: z.infer<typeof usageEventsSchema>,
  config: {
    queueUrl: string;
    region?: string;
    credentials?: AwsCredentialIdentity;
  },
): Promise<void> {
  const { queueUrl, region = "us-west-2", credentials } = config;

  const entries = usageEventsSchema.parse(usageEvents).map((event) => ({
    MessageBody: JSON.stringify(event),
  })) as unknown as SendMessageBatchRequestEntry[];

  const input = new SendMessageBatchCommand({
    QueueUrl: queueUrl,
    Entries: entries,
  });
  await getSqs({ region, credentials }).send(input);
}
